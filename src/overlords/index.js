import log from '../utils/log'

function refresh (o) {
  o.room = Game.room[o.pos.roomName]

  for (const role of o._creeps) {
    for (const creep of o._creeps[role]) {
      const c = global.overmind[creep.name]

      if (c) {
        c.refresh()
      } else {
        log('WARNING', `${o.print()}: could not find and refresh creep with name ${creep.name}`)
      }
    }
  }
}

// TODO: Finish this :)
function recalculateCreeps (o) {
  o._creeps = _.mapValues(global.overmind.cache.overlords[o.ref],
    creepsOfRole => _.map(creepsOfRole, creepName => Game.creeps[creepName]))
}

export {
  refresh,
  recalculateCreeps
}
