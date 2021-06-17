const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')

module.exports.loop = function () {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester')
  console.log('Harvesters: ' + harvesters.length)

  if (harvesters.length < 2) {
    const newName = 'Harvester' + Game.time
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: 'harvester' } })
  }



  if (Game.spawns['home'].spawning) {
    const spawningCreep = Game.creeps[Game.spawns['home'].spawning.name]
    Game.spawns['home'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['home'].pos.x + 1,
      Game.spawns['home'].pos.y,
      { align: 'left', opacity: 0.8 })
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]

    switch (creep.memory.role) {
      case 'harvester':
        roleHarvester.run(creep)
        break
      case 'upgrader':
        roleUpgrader.run(creep)
        break
      case 'builder':
        roleBuilder.run(creep)
        break
      default:
        break
    }
  }
}
