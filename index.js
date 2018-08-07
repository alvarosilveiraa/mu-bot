const readInput = require('./util/readInput');
const firebase = require('firebase');
firebase.initializeApp({
  apiKey: "AIzaSyAr6yca2FCz22I_9ORGhIkHXyjf9s-jOqM",
  authDomain: "mu-bot-790c0.firebaseapp.com",
  databaseURL: "https://mu-bot-790c0.firebaseio.com",
  projectId: "mu-bot-790c0",
  storageBucket: "mu-bot-790c0.appspot.com",
  messagingSenderId: "355298617230"
});
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

const listenEvents = async (db) => {
  const hardware = require('./modules/hardware');
  await readInput('Configure sua ida ao spot (pressione enter)...');
  hardware.startListener();
  await readInput('Terminar configuração (pressione enter)...');
  const events = hardware.stopListener();
  await db.update({ 'spot.events': events });
  process.exit();
}

const startBot = async () => {
  const collection = await readInput('DB Name: ');
  const nickname = await readInput('Nickname: ');
  const db = firestore.collection(collection).doc(nickname);
  const char = await db.get();
  if(char.exists) {
    const data = char.data();
    if(data.spot.events.length) {
      const option = await readInput('Escolha uma das opções:\n\n1 - Iniciar última configuração de ida ao spot\n2 - Criar nova configuração de ida ao spot\n\n> ');
      if(option === '1') {
        const bot = require('./bot');
        bot(db, data);
      }else if(option === '2') await listenEvents(db);
    }else await listenEvents(db);
  }else initialize();
}

const createChar = async () => {
  const collection = await readInput('DB Name: ');
  const nickname = await readInput('Nickname: ');
  const spotMap = await readInput('Spot map number: ');
  const spotCoordinate = await readInput('Spot coordinate: ');
  const db = firestore.collection(collection).doc(nickname);
  await db.set({
    started: false,
    deaths: 0,
    map: 0,
    coordinate: [0, 0],
    spot: {
      map: spotMap,
      coordinate: spotCoordinate.split(' '),
      events: []
    }
  });
  process.exit();
}

const listChars = async () => {
  const collection = await readInput('DB Name: ');
  const db = firestore.collection(collection);
  const chars = await db.get();
  console.log('\x1Bc');
  chars.forEach(char => {
    if(char.exists)
      console.log(char.id);
  });
  process.exit();
}

const initialize = async () => {
  const option = await readInput('Escolha uma das opções:\n\n1 - Escolher char\n2 - Criar char\n3 - Listar chars\n\n> ');
  switch(option) {
    case '1':
      startBot();
      break;
    case '2':
      createChar();
      break;
    case '3':
      listChars();
      break;
    default:
      initialize();
      break;
  }
}
initialize();
