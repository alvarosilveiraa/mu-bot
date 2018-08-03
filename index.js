const memoryjs = require('memoryjs');
const MAPS = require('./data/maps.json');

const object = memoryjs.openProcess('main.exe');

const coordinate = {
  x: memoryjs.readMemory(object.handle, 0x081C038C, memoryjs.INT),
  y: memoryjs.readMemory(object.handle, 0x081C0388, memoryjs.INT)
}

console.log(coordinate);

const potions = {
  hp: memoryjs.readMemory(object.handle, 0x2590C158, memoryjs.INT),
  mana: memoryjs.readMemory(object.handle, 0x2590BDB0, memoryjs.INT)
}

console.log(potions);

const map = memoryjs.readMemory(object.handle, 0x00E61E18, memoryjs.INT);

console.log(MAPS[map] || map);
