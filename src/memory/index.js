import { isIVM } from '../utils'
import {
  DEFAULT_OP_MODE,
  DEFAULT_OVERMIND_SIG,
  PROFILER_COLONY_LIMIT,
  USE_PROFILER
} from '../settings'
import log from '../utils/log'

let lastMemory = null
let lastTime = 0
const MAX_BUCKET = 10000
const HEAP_CLEAN_FREQ = 200
const BUCKET_CLEAR_CACHE = 7000
const BUCKET_CPU_HALT = 4000

function shouldRun () {
  let run = true

  if (!isIVM()) {
    log('WARNING', 'Overmind requires isolated-VM to run. Change settings at screeps.com/a/#!/account/runtime')
    run = false
  }

  if (USE_PROFILER && Game.time % 10 === 0) {
    log('WARNING', `Profiling is currently enabled; only ${PROFILER_COLONY_LIMIT} colonies will be run!`)
  }

  if (Game.cpu.bucket < 500) {
    if (_.keys(Game.spawns).length > 1 && !Memory.resetBucket && !Memory.haltTick) {
      log('WARNING', `CPU bucket is critically low (${Game.cpu.bucket})! Starting CPU reset routine.`)

      Memory.resetBucket = true
      Memory.haltTick = Game.time + 1
    } else {
      log('INFO', `CPU bucket is too low (${Game.cpu.bucket}). Postponing operation until bucket reaches 500.`)
    }

    run = false
  }

  if (Memory.resetBucket) {
    if (Game.cpu.bucket < MAX_BUCKET - Game.cpu.limit) {
      log('INFO', `Operation suspended until bucket recovery. Bucket: ${Game.cpu.bucket}/${MAX_BUCKET}`)
      run = false
    } else {
      Memory.resetBucket = null
    }
  }

  if (Memory.haltTick) {
    if (Memory.haltTick === Game.time) {
      Game.cpu.halt()
      run = false
    } else if (Memory.haltTick < Game.time) {
      Memory.haltTick = null
    }
  }

  return run
}

function load () {
  if (lastTime && lastMemory && Game.time === lastTime + 1) {
    global.Memory = lastMemory
    RawMemory._parsed = lastMemory
  } else {
    // Forces parsing
    Memory.rooms // eslint-disable-line
    lastMemory = RawMemory._parsed
    Memory.stats.persistent.lastMemoryReset = Game.time
  }

  lastTime = Game.time
  if (!global.age) {
    global.age = 0
  }

  global.age++
  Memory.stats.persistent.globalAge = global.age
}

function garbageCollect (quick = false) {
  // Sometimes garbage collection isn't available
  if (global.gc) {
    const start = Game.cpu.getUsed()

    global.gc(quick)
    log('DEBUG', `Running ${quick ? 'quick' : 'FULL'} garbage collection. ` +
      `Elapsed time: ${Game.cpu.getUsed() - start}.`)
  } else {
    log('DEBUG', 'Manual garbage collection is unavailable on this server.')
  }
}

function wrap (memory, memName, defaults = {}, deep = false) {
  if (!memory[memName]) {
    memory[memName] = _.clone(defaults)
  }

  if (deep) {
    _.defaultsDeep(memory[memName], defaults)
  } else {
    _.defaults(memory[memName], defaults)
  }

  return memory[memName]
}

function _setDeep (obj, keys, value) {
  const key = _.first(keys)
  const tailKeys = _.drop(keys)

  if (!tailKeys.length) {
    obj[key] = value
  } else {
    if (!obj[key]) {
      obj[key] = {}
    }

    return _setDeep(obj[key], tailKeys, value)
  }
}

function setDeep (obj, key, val) {
  const keys = key.split('.')

  return _setDeep(obj, keys, val)
}

function _formatPathingMem () {
  if (!Memory.pathing) {
    Memory.pathing = {}
  }

  _.defaults(Memory.pathing, {
    paths: {},
    distances: {},
    weightedDistances: {}
  })
}

function _formatDefaultMem () {
  const actors = [
    'rooms',
    'creeps',
    'flags',
    'overmind',
    'colonies',
    'settings',
    'stats',
    'constructionSites'
  ]

  actors.forEach(a => {
    if (!Memory[a]) {
      Memory[a] = {}
    }
  })
}

function simpleCleaners () {
  const stores = new Set([
    'creeps',
    'flags'
  ])

  for (const s of stores) {
    for (const n in Memory[s]) {
      if (!Game[s][n]) {
        // While I don't like using delete
        // These are active memory stores that will need cleaned
        // We sadly can't just null them out
        delete Memory[s][n]
        delete global[n]
      }
    }
  }
}

function cleanColonies () {
  for (const n in Memory.colonies) {
    const room = Game.rooms[n]

    if (!(room && room.my)) {
      // Only delete if persistent is not set, I.E for "praise rooms"
      if (!Memory.colonies[n].persistent) {
        // While I don't like using delete
        // These are active memory stores that will need cleaned
        // We sadly can't just null them out
        delete Memory.colonies[n]
        delete global[n]
      }
    }
  }
}

function cleanConSites () {
  if (Game.time % 10 === 0) {
    const CON_SITE_TIMEOUT = 50000

    for (const id in Game.constructionSites) {
      const site = Game.constructionSites[id]

      if (!Memory.constructionSites[id]) {
        Memory.constructionSites[id] = Game.time
      } else if (Game.time - Memory.constructionSites[id] > CON_SITE_TIMEOUT) {
        site.remove()
      }

      if (site && site.pos.isVisible && site.pos.lookForStructure(site.structureType)) {
        site.remove()
      }
    }

    for (const id in Memory.constructionSites) {
      if (!Game.constructionSites[id]) {
        delete Memory.constructionSites[id]
      }
    }
  }
}

function cleanPathingMemory () {
  const CLEAN_FREQ = 5

  // Randomly clear out some cached pathing lengths
  if (Game.time % CLEAN_FREQ === 0) {
    const distanceCleanProb = 0.001 * CLEAN_FREQ
    const weightedDistanceCleanProb = 0.01 * CLEAN_FREQ

    for (const pos1Name in Memory.pathing.distances) {
      if (_.isEmpty(Memory.pathing.distances[pos1Name])) {
        delete Memory.pathing.distances[pos1Name]
      } else {
        for (const pos2Name in Memory.pathing.distances[pos1Name]) {
          if (Math.random() < distanceCleanProb) {
            delete Memory.pathing.distances[pos1Name][pos2Name]
          }
        }
      }
    }

    // Randomly clean weighted distances
    for (const pos1Name in Memory.pathing.weightedDistances) {
      if (_.isEmpty(Memory.pathing.weightedDistances[pos1Name])) {
        delete Memory.pathing.weightedDistances[pos1Name]
      } else {
        for (const pos2Name in Memory.pathing.weightedDistances[pos1Name]) {
          if (Math.random() < weightedDistanceCleanProb) {
            delete Memory.pathing.weightedDistances[pos1Name][pos2Name]
          }
        }
      }
    }
  }
}

function createGlobalMemory () {
  global._cache = {
    accessed: {},
    expiration: {},
    structures: {},
    numbers: {},
    lists: {},
    costMatrices: {},
    roomPositions: {},
    things: {} // Idk a catch all I guess?
  }

  simpleCleaners()
  cleanColonies()
  cleanConSites()
  cleanPathingMemory()
  cleanHeap()
}

function cleanHeap () {
  if (Game.time % HEAP_CLEAN_FREQ === HEAP_CLEAN_FREQ - 3) {
    if (Game.cpu.bucket < BUCKET_CPU_HALT) {
      Game.cpu.halt()
    } else if (Game.cpu.bucket < BUCKET_CLEAR_CACHE) {
      delete global._cache
      createGlobalMemory()
    }
  }
}

function format () {
  _formatPathingMem()
  _formatDefaultMem()

  if (!USE_PROFILER) {
    Memory.profiler = null
  }

  _.defaults(Memory.settings, {
    signature: DEFAULT_OVERMIND_SIG,
    opMode: DEFAULT_OP_MODE,
    log: {},
    enableVisuals: true
  })

  if (!Memory.stats.persistent) {
    Memory.stats.persistent = {}
  }

  createGlobalMemory()
}

export {
  format,
  load,
  garbageCollect,
  setDeep,
  shouldRun,
  wrap
}
