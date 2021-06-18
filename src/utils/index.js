function getAllColonyRooms () {
  return _.filter(_.values(Game.rooms), room => room.my)
}

function printRoomName (roomName) {
  return `<a href="#!/room/${Game.shard.name}/${roomName}>${roomName}</a>`
}

function isIVM () {
  return typeof Game.cpu.getHeapStatistics === 'function'
}

function color (str, color) {
  return `<font color='${color}'>${str}</font>`
}

function getUsername () {
  for (const i in Game.rooms) {
    const room = Game.rooms[i]

    if (room.controller && room.controller.my) {
      return room.controller.owner.username
    }
  }

  for (const i in Game.creeps) {
    const creep = Game.creeps[i]

    if (creep.owner) {
      return creep.owner.username
    }
  }
}

function onPublicServer () {
  return Game.shard.name.includes('shard')
}

function onTrainingEnvironment () {
  return !Memory.reinforcementLearning && !Memory.reinforcementLearning.enabled
}

function getReinforcementLearningTrainingVerbosity () {
  if (Memory.reinforcementLearning) {
    if (Memory.reinforcementLearning.verbosity !== undefined) {
      return Memory.reinforcementLearning.verbosity
    }
  }
  return 0
}

export {
  color,
  getAllColonyRooms,
  getReinforcementLearningTrainingVerbosity,
  getUsername,
  onPublicServer,
  onTrainingEnvironment,
  printRoomName,
  isIVM
}
