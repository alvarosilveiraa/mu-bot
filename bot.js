const autoitjs = require('./modules/autoitjs');
const memoryjs = require('./modules/memoryjs');
const { isInCoordinate } = require('./util/geolocation');
const readInput = require('./util/readInput');
const sleep = require('./util/sleep');

autoitjs.Init();

const windowFocus = handle => {
  const active = autoitjs.WinActive(handle);
  if(!active) autoitjs.WinActivate(handle);
}

const checkProcess = async (winList) => {
  const processes = winList.map(win => {
    const PID = autoitjs.WinGetProcess(win.handle);
    return {
      PID,
      ...win
    }
  });
  const index = await readInput(`Selecione a janela que irá executar o bot:\n\n${processes.map((p, i) => i + ' - ' + p.PID).join('\n')}\n\n> `);
  const selected = processes[index];
  windowFocus(selected.handle);
  const confirm = await readInput('Confirmar janela? [y/n]\n\n> ');
  if(confirm === 'n' || confirm === 'N')
    return await checkProcess(winList);
  return { ...selected };
}

module.exports = async (db, char) => {
  const DEATH_LOOP = 10;
  const WINDOW_LIST = await autoitjs.WinList('PvP MuOnline');
  const WINDOW_SELECTED = await checkProcess(WINDOW_LIST);
  const WINDOW_POSITION = autoitjs.WinGetPos(WINDOW_SELECTED.handle);
  const OBJECT = memoryjs.openProcess(WINDOW_SELECTED.PID);
  windowFocus(WINDOW_SELECTED.handle);

  let map = null;
  let coordinate = [];
  let lastCoordinate = [];
  let equal = 0;

  const updateMap = async () => {
    map = memoryjs.readMemory(OBJECT.handle, 0x00E61E18, memoryjs.INT);
    await db.update({ map });
  }

  const updateCoordinate = async () => {
    coordinate = [
      memoryjs.readMemory(OBJECT.handle, 0x081C038C, memoryjs.INT),
      memoryjs.readMemory(OBJECT.handle, 0x081C0388, memoryjs.INT)
    ]
    if(
      lastCoordinate[0] === coordinate[0] &&
      lastCoordinate[1] === coordinate[1] &&
      equal < DEATH_LOOP + 1
    ) equal++;
    else equal = 0;
    lastCoordinate = coordinate;
    await db.update({ coordinate });
  }

  const goToMove = async () => {
    if(map == char.spot.map)
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
    if(equal >= DEATH_LOOP) {
      const { top, left, right, bottom } = WINDOW_POSITION;
      const x = left + (right - left) / 2;
      const y = (top + (bottom - top) / 2) - 40;
      windowFocus(WINDOW_SELECTED.handle);
      autoitjs.Game.mouseclick({ x, y });
    }
    await updateMap();
    await updateCoordinate();
    if(map != char.spot.map || !isInCoordinate(coordinate, char.spot.coordinate, 6)) {
      windowFocus(WINDOW_SELECTED.handle);
      await goToMove();
      await goToSpot();
    }
    await sleep(4000);
    initialize();
  }
  console.log('\x1Bc');
  console.log('### BOT STARTED ###');
  initialize();
}
