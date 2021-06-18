import {
  getUsername,
  getReinforcementLearningTrainingVerbosity,
  onPublicServer,
  onTrainingEnvironment
} from './utils'

const USERNAME = getUsername()
const USE_PROFILER = false
const PROFILER_COLONY_LIMIT = Math.ceil(Game.gcl.level / 2)
const PROFILER_INCLUDE_COLONIES = []
const OVERMIND_SMALL_CAPS = '\u1D0F\u1D20\u1D07\u0280\u1D0D\u026A\u0274\u1D05'
const DEFAULT_OVERMIND_SIG = `\u00ab${OVERMIND_SMALL_CAPS}\u00bb`
const DEFAULT_OP_MODE = 'automatic'
const MAX_OWNED_ROOMS = Infinity
const SHARD3_MAX_OWNED_ROOMS = 3
const NEW_OVERMIND_INTERVAL = onPublicServer() ? 20 : 5
const GUI_SCALE = 1.0
const RL_TRAINING_MODE = onTrainingEnvironment()
const RL_TRAINING_VERBOSITY = getReinforcementLearningTrainingVerbosity()

global.__DEFAULT_OVERMIND_SIG__ = DEFAULT_OVERMIND_SIG

export {
  USERNAME,
  USE_PROFILER,
  PROFILER_COLONY_LIMIT,
  PROFILER_INCLUDE_COLONIES,
  OVERMIND_SMALL_CAPS,
  DEFAULT_OVERMIND_SIG,
  DEFAULT_OP_MODE,
  MAX_OWNED_ROOMS,
  SHARD3_MAX_OWNED_ROOMS,
  NEW_OVERMIND_INTERVAL,
  GUI_SCALE,
  RL_TRAINING_MODE,
  RL_TRAINING_VERBOSITY
}
