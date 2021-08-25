// const open = require('open');
const fs = require('fs');
const { getFirebaseDb } = require('./firebase');
const { log } = require('./log');
const { run } = require('./stalker');
const { setTrayTooltip } = require('../helpers/tray');
const { showNotice } = require('../helpers/notification');
const { openBrowserWindow, hideBrowserWindow } = require('../helpers/browser-window');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const filterDir = (p) => {
  const base = p.replace('all:', '');
  const allChildPath = fs.readdirSync(base);
  const ignore = ['System Volume Information'];
  return allChildPath
    .filter((path) => {
      if (path.includes('.')) return false;
      if (ignore.includes(path)) return false;
      return true;
    })
    .map((p) => {
      p = base + p;
      return p;
    });
};

const readDir = (data) => {
  if (data.path.includes('all:')) {
    const allPath = data.path.split(';');
    let newPaths = [];

    for (let i = 0; i < allPath.length; i++) {
      const p = allPath[i];
      if (p.includes('all:')) {
        const allChildPath = filterDir(p);
        newPaths = newPaths.concat(allChildPath);
        continue;
      }

      if (!newPaths.includes(p)) {
        newPaths.push(p);
      }
    }

    data.path = newPaths;
  } else {
    data.path = data.path.split(';');
  }
  return data;
};

const signin = (configPath) => {
  return new Promise((resolve, reject) => {
    const db = getFirebaseDb();
    const token = uuidv4();
    const ref = db.ref(`sign-in-agent-token/${token}`);
    const configRef = db.ref(`configs/host`);

    if (fs.existsSync(configPath)) {
      log.info('CONFIG DATA IS EXIST');

      const data = fs.readFileSync(configPath, 'utf-8');

      try {
        resolve(readDir(JSON.parse(data)));
      } catch (err) {
        setTrayTooltip('Agent signing error');
        reject(err);
      }
      return;
    }

    log.info('CONFIG DATA IS NOT EXIST');
    showNotice('Agent start checking ....');

    // getting sign in agent page
    configRef.get().then((cfgSnapshot) => {
      let hostname = 'http://localhost:3000/sign-in-agent';
      if (cfgSnapshot.exists()) {
        hostname = cfgSnapshot.val();
        hostname = hostname.trim().replace(/\/+$/g, '');
      }
      // open sign in page with a token
      ref.set(1, async (err) => {
        if (err) {
          reject(err);
          setTrayTooltip('Agent signing error');
          return;
        }

        log.info(`OPENING: ${hostname}/${token}`);
        // await open(`${hostname}/${token}`);
        openBrowserWindow(`${hostname}/${token}`);
      });
    });

    // when user signed in successfully, save the config and remove token
    let removing = false;
    ref.on('value', (snapshot) => {
      if (removing) {
        log.info('REFERENCE REMOVED SUCCESSFULLY');
        removing = false;
        return;
      }

      if (!snapshot.exists()) {
        reject('NO DATA RETURN FROM ADMIN');
        log.info('ERR: NO DATA RETURN FROM ADMIN');
        return;
      }

      const data = snapshot.val();

      if (typeof data !== 'object') {
        log.info('ERR: WRITING DOWN CONFIG DATA');
        return;
      }

      log.info('WRITING DOWN CONFIG DATA');
      fs.writeFileSync(configPath, JSON.stringify(data));

      // make sure that token is removed
      removing = true;
      hideBrowserWindow();
      ref.remove().then(() => {
        const refactorData = readDir(data);
        log.info('REMOVED SIGNING KEY SUCCESSFULLY !');
        try {
          log.info('RUN STALKER', refactorData);
          run(refactorData);
          // resolve(refactorData);
        } catch (error) {
          log.error(error);
        }
      });
    });
  });
};

exports.signin = signin;
