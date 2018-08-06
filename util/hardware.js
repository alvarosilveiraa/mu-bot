const ioHook = require('iohook');

const CHAR_CODES = {
  30: 'A',
  48: 'B',
  46: 'C',
  32: 'D',
  18: 'E',
  33: 'F',
  34: 'G',
  35: 'H',
  23: 'I',
  36: 'J',
  37: 'K',
  38: 'L',
  50: 'M',
  49: 'N',
  24: 'O',
  25: 'P',
  16: 'Q',
  19: 'R',
  31: 'S',
  20: 'T',
  22: 'U',
  47: 'V',
  17: 'W',
  45: 'X',
  21: 'Y',
  44: 'Z',

  28: 'ENTER'
}

let events = [];
const startListener = () => {
  events = [];
  let delay = 0;
  let time = new Date().getTime();
  ioHook.on('mouseclick', event => {
    const now = new Date().getTime();
    delay = now - time;
    time = now;
    events.push({ ...event, delay });
  });
  ioHook.on('keydown', event => {
    const now = new Date().getTime();
    delay = now - time;
    time = now;
    events.push({ ...event, delay, key: CHAR_CODES[event.keycode], type: 'keyboard' });
  });
  ioHook.start();
}

const stopListener = () => {
  ioHook.stop();
  return events;
}

module.exports = {
  startListener,
  stopListener
}


