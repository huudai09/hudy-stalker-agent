const dayjs = require('dayjs');
const firebase = require('firebase/app');
require('firebase/database');
require('firebase/firestore');
const { log } = require('./log');

const firebaseConfig = {
  apiKey: 'AIzaSyA2rsZB4jHCh2YAwrJQgWJ2R99f9hPlgD4',
  authDomain: 'grows-c7b16.firebaseapp.com',
  projectId: 'grows-c7b16',
  storageBucket: 'grows-c7b16.appspot.com',
  messagingSenderId: '1071803235178',
  databaseURL: 'https://grows-c7b16-default-rtdb.asia-southeast1.firebasedatabase.app/',
  appId: '1:1071803235178:web:2df31c4a5b5c367f6b8313',
  measurementId: 'G-1XDL4LH85L',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fireStore = firebase.firestore();

exports.getFirebaseDb = () => {
  return firebase.database();
};

exports.updateSkill = ({ username, extension }) => {
  try {
    if (!extension) return;
    extension = extension.replace('.', '');
    const now = dayjs();
    const month = now.format('YYYY-MM');

    const refLink = `skills/${month}/${username}/${extension}`;
    const ref = firebase.database().ref(refLink);

    ref
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          ref.set(snapshot.val() + 1);
        } else {
          ref.set(1);
        }
      })
      .catch((error) => {
        log.error('GET skills ERROR:', error);
      });
  } catch (error) {
    log.info('updateSkill ERROR');
  }
};

exports.addActivity = ({ repo, branch, username, loc }) => {
  try {
    repo = repo.replace(/\.git/, '');
    const now = dayjs();
    const date = now.date();
    const month = now.month();
    const year = now.year();
    const hour = now.hour();
    const minute = now.minute();
    const fullDate = now.format('YYYY-MM-DD');
    const periodTime = minute < 30 ? '00' : 30;
    const time = `${hour}-${periodTime}`;

    const refLink = `activities/${fullDate}/${username}/${time}/${repo}/${branch}`;
    const ref = firebase.database().ref(refLink);

    ref
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          ref.set(snapshot.val() + 1);
        } else {
          ref.set(1);
        }
      })
      .catch((error) => {
        log.error('addActivity ERROR:', error);
      });
  } catch (error) {
    log.error('addActivity:', error);
  }
};

exports.runTimekeeper = (username) => {
  try {
    const now = dayjs();
    const day = now.format('YYYY-MM-DD');
    const hour = now.hour();
    const min = now.minute();
    const period = 5; // 5 minute
    const periodTime = Math.ceil(min / period);
    const time = `${hour}-${periodTime * period}`;
    const refLink = `time-keeper/${day}/${username}`;
    const ref = firebase.database().ref(refLink);

    ref
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const times = snapshot.val();
          if (!times || !times.includes(time)) {
            times.push(time);
            ref.set(times);
          }
          return;
        }

        ref.set([time]);
      })
      .catch((error) => {
        log.error('runTimekeeper ERROR:', error);
      });
  } catch (error) {
    log.error('runTimekeeper ERROR:', error);
  }
};

exports.addWorkingTime = ({ username }) => {
  const now = dayjs();
  const day = now.format('YYYY-MM-DD');
  const hour = now.hour();
  const min = now.minute();
  const periodTime = min < 30 ? '00' : 30;
  const time = `${hour}-${periodTime}`;
  const refLink = `working-time/${day}/${username}/${time}`;
  const workingTimeRef = firebase.database().ref(refLink);

  workingTimeRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        workingTimeRef.set(snapshot.val() + 1);
      } else {
        workingTimeRef.set(1);
      }
    })
    .catch((error) => {
      log.error('addWorkingTime ERROR:', error);
    });

  // const newActivity = workingTimeRef.push();
  // newActivity.set({});
};
