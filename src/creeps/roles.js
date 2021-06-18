import { createCreep } from './index'

const ROLES = {
  DRONE: 'drone',
  FILLER: 'filler',
  CLAIM: 'claim',
  PIONEER: 'pioneer',
  MANAGER: 'manager',
  QUEEN: 'queen',
  SCOUT: 'scout',
  TRANSPORT: 'transport',
  WORKER: 'worker',
  UPGRADER: 'upgrader'
}

const foundation = {
  drones: {
    extractor: createCreep({
      role: ROLES.DRONE,
      pattern: [WORK, WORK, CARRY, MOVE]
    }),

    miners: {
      defaults: createCreep({
        role: ROLES.DRONE,
        pattern: [WORK, WORK, CARRY, MOVE],
        sizeLimit: 3
      }),
      standard: createCreep({
        role: ROLES.DRONE,
        pattern: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        sizeLimit: 1
      }),
      emergency: createCreep({
        role: ROLES.DRONE,
        pattern: [WORK, WORK, CARRY, MOVE],
        sizeLimit: 1
      }),
      double: createCreep({
        role: ROLES.DRONE,
        pattern: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        sizeLimit: 2
      }),
      sourceKeeper: createCreep({
        role: ROLES.DRONE,
        pattern: [WORK, WORK, CARRY, MOVE],
        sizeLimit: 5
      })
    }
  },

  filler: {
    default: createCreep({
      role: ROLES.FILLER,
      pattern: [CARRY, CARRY, MOVE],
      sizeLimit: 1
    })
  },

  infestors: {
    claim: createCreep({
      role: ROLES.CLAIM,
      pattern: [CLAIM, MOVE],
      sizeLimit: 1
    }),
    reserve: createCreep({
      role: ROLES.CLAIM,
      pattern: [CLAIM, MOVE],
      sizeLimit: 4
    }),
    controllerAttacker: createCreep({
      role: ROLES.CLAIM,
      pattern: [CLAIM, MOVE],
      sizeLimit: Infinity
    })
  },

  pioneer: {
    default: createCreep({
      role: ROLES.PIONEER,
      pattern: [WORK, WORK, MOVE, MOVE],
      sizeLimit: Infinity
    })
  },

  managers: {
    default: createCreep({
      role: ROLES.MANAGER,
      pattern: [CARRY, CARRY, CARRY, CARRY, MOVE],
      sizeLimit: 3
    }),
    twoPart: createCreep({
      role: ROLES.MANAGER,
      pattern: [CARRY, CARRY, MOVE],
      sizeLimit: 8
    }),
    stationary: createCreep({
      role: ROLES.MANAGER,
      pattern: [CARRY, CARRY],
      sizeLimit: 8
    }),
    stationaryWork: createCreep({
      role: ROLES.MANAGER,
      pattern: [WORK, WORK, WORK, WORK, CARRY, CARRY],
      sizeLimit: 8
    })
  },

  queens: {
    default: createCreep({
      role: ROLES.QUEEN,
      pattern: [CARRY, CARRY, MOVE],
      sizeLimit: Infinity
    }),
    early: createCreep({
      role: ROLES.QUEEN,
      pattern: [CARRY, MOVE],
      sizeLimit: Infinity
    })
  },

  scout: {
    default: createCreep({
      role: ROLES.SCOUT,
      pattern: [MOVE],
      sizeLimit: 1
    })
  },

  transporters: {
    default: createCreep({
      role: ROLES.TRANSPORT,
      pattern: [CARRY, CARRY, MOVE],
      sizeLimit: Infinity
    }),
    early: createCreep({
      role: ROLES.TRANSPORT,
      pattern: [CARRY, MOVE],
      sizeLimit: Infinity
    })
  },

  workers: {
    default: createCreep({
      role: ROLES.WORKER,
      pattern: [WORK, WORK, WORK, CARRY, MOVE],
      sizeLimit: Infinity
    }),
    rc: createCreep({
      role: ROLES.WORKER,
      pattern: [WORK, WORK, WORK, CARRY, MOVE],
      sizeLimit: 5
    })
  },

  upgraders: {
    default: createCreep({
      role: ROLES.UPGRADER,
      pattern: [WORK, WORK, WORK, CARRY, MOVE],
      sizeLimit: Infinity
    }),
    rc: createCreep({
      role: ROLES.UPGRADER,
      pattern: [WORK, WORK, WORK, CARRY, MOVE],
      sizeLimit: 5
    })
  }
}

export {
  foundation
}
