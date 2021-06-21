# ScrapsAI
Randomly got back into screeps decided to play with AI stuff again.

This repository is my AI for playing Screeps.

- [Screeps Steam Store](https://store.steampowered.com/app/464350/Screeps_World/)
- [Screeps Tutorial](https://screeps.com/a/#!/sim/tutorial/1)
- [Screeps Guide](https://docs.screeps.com/introduction.html#Game-world)
- [Screeps API Docs](https://docs.screeps.com/api/)

The idea is to build out "Overlords" Which handle tasks, operations, etc for rooms. These overlords are then led by the main Overseer which is the main loop.

## Building

[Rollup](https://rollupjs.org/guide/en/) Build
   - This allows me to build my AI using ES Modules, then build it into a main.js and cp into the game directory.
   - I use a copy bash script to move the folder when done
