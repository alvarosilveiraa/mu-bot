const MAPS = require('./data/maps.json');
const MOVES = require('./data/moves.json');
const SPOT = {
  map: 37,
  coordinate: [153, 14]
}

const sleep = time => new Promise(resolve, setTimeout(resolve, time));

// AUTOIT -----------------
const au = require('autoit');
au.Init();
const HANDLE = au.WinGetHandle('PvP MuOnline');
const CONTROL = au.ControlGetHandle(HANDLE, '');
au.ControlFocus(HANDLE, CONTROL);

// au.WinList('PvP MuOnline')
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

const keyboardTap = (key, delay=300) => {
  return new Promise(resolve => {
    au.Send(`{${key} down}`);
    setTimeout(() => {
      au.Send(`{${key} up}`);
      resolve();
    }, delay);
  })
}

const position = au.WinGetPos(HANDLE);
const mouseClick = (e, time=200) => {
  return new Promise(resolve => {
    if(typeof e === 'string') {
      const x = position.left + (position.right - position.left) / 2;
      const y = position.top + (position.bottom - position.top) / 2;
      const coordinate = {
        map: [position.left + 100, position.top + MOVES[SPOT.map].top],
        attack: [position.left + 228, position.top + 36],
        top: [x, y - 80],
        left: [x - 80, y - 40],
        right: [x + 80, y - 40],
        bottom: [x, y + 20]
      }[e];
      au.MouseMove(coordinate[0], coordinate[1]);
    }else au.MouseMove(e.x, e.y);
    au.MouseDown('left');
    setTimeout(() => au.MouseUp('left'), time);
    setTimeout(resolve, e.delay || 400);
  })
}

// MEMORY ------------------------
const memoryjs = require('memoryjs');
const OBJECT = memoryjs.openProcess('main.exe');

let map = null, coordinate = [];
const updateMap = () => {
  map = memoryjs.readMemory(OBJECT.handle, 0x00E61E18, memoryjs.INT);
}

const updateCoordinate = () => {
  coordinate = [
    memoryjs.readMemory(OBJECT.handle, 0x081C038C, memoryjs.INT),
    memoryjs.readMemory(OBJECT.handle, 0x081C0388, memoryjs.INT)
  ]
}

const isCoordinateRange = () => {
  const range = 8;
  if(
    coordinate[0] < SPOT.coordinate[0] - range ||
    coordinate[0] > SPOT.coordinate[0] + range
  ) return false;
  if(
    coordinate[1] < SPOT.coordinate[1] - range ||
    coordinate[1] > SPOT.coordinate[1] + range
  ) return false;
  return true;
}

const goToMap = async () => {
  await keyboardTap('m');
  await mouseClick('map');
  await sleep(2000);
  updateMap();
}

const goToMove = async () => {
  if(map === SPOT.map)
    await sleep(4000);
}

const goToSpot = async (index=0) => {
  const event = MOVES[SPOT.map].events[index];
  if(event) {
    await mouseClick(event);
    return goToSpot(index + 1);
  }else return null;
}

// INITIALIZE ----------------

const initialize = async () => {
  updateMap();
  updateCoordinate();
  if(map !== SPOT.map || !isCoordinateRange()) {
    await goToMap();
    await goToMove();
    await goToSpot();
    updateCoordinate();
    if(isCoordinateRange())
      await mouseClick('attack');
    initialize();
  }else setTimeout(initialize, 4000);
}
initialize();

// const ioHook = require('iohook');
// let d = new Date().getTime(), delay = 0;;
// ioHook.on('mouseclick', event => {
//   const now = new Date().getTime();
//   delay = now - d;
//   d = now;
//   console.log({ ...event, delay });
// });
// ioHook.start();


// const robot = require('robotjs');
// setInterval(() => robot.scrollMouse(0, -50), 1000);
