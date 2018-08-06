'use strict';

const autoitjs = require('./modules/autoitjs');
const memoryjs = require('./modules/memoryjs');
const { isInCoordinate } = require('./util/geolocation');

module.exports = (db, char) => {
  // AUTOITJS
  autoitjs.Init();
  const HANDLE = autoitjs.WinGetHandle('PvP MuOnline');
  const CONTROL = autoitjs.ControlGetHandle(HANDLE, '');
  const WINDOW_POSITION = autoitjs.WinGetPos(HANDLE);
  autoitjs.ControlFocus(HANDLE, CONTROL);

  // MEMORYJS
  const OBJECT = memoryjs.openProcess('main.exe');

  let map = null;
  let coordinate = [];
  let lastCoordinate = [];
  let equal = 0;

  const updateMap = () => map = memoryjs.readMemory(OBJECT.handle, 0x00E61E18, memoryjs.INT);

  const updateCoordinate = () => {
    coordinate = [
      memoryjs.readMemory(OBJECT.handle, 0x081C038C, memoryjs.INT),
      memoryjs.readMemory(OBJECT.handle, 0x081C0388, memoryjs.INT)
    ]
    if(
      lastCoordinate[0] === coordinate[0] &&
      lastCoordinate[1] === coordinate[1] &&
      equal < 6
    ) equal++;
    else equal = 0;
    lastCoordinate = coordinate;
  }

  const goToMove = async () => {
    if(map === char.spot.map)
      await sleep(4000);
  }

  const goToSpot = async (index=0) => {
    const event = char.spot.events[index];
    if(event) {
      await autoitjs.Game[event.type](event);
      return goToSpot(index + 1);
    }else return null;
  }

  const initialize = async () => {
    if(equal >= 5) {
      const { top, left, right, bottom } = WINDOW_POSITION;
      const x = left + (right - left) / 2;
      const y = top + (bottom - top) / 2;
      autoitjs.Game.mouseClick({ coordinate: [x, y - 40] });
    }
    updateMap();
    updateCoordinate();
    if(map !== char.spot.map || !isInCoordinate(coordinate, map.spot.coordinate)) {
      await goToMove();
      await goToSpot();
      initialize();
    }else setTimeout(initialize, 4000);
  }
  // initialize();

  autoitjs.WinList('npm')
    .then(list => {
      const processes = list.map(win => {
        const PID = autoitjs.WinGetProcess(win.handle);
        return {
          PID,
          ...win
        }
      });
    }).catch(err => console.log(err));
}
