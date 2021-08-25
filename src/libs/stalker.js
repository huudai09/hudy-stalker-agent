const chokidar = require('chokidar');
const path = require('path');
const { addActivity, addWorkingTime, runTimekeeper, updateSkill } = require('./firebase');
const { getBranchName, getGitUserEmail, getRepositoryName } = require('./git');
const { getLoc } = require('./loc');
const { log } = require('./log');
const { setTrayTooltip } = require('../helpers/tray');
const { showNotice } = require('../helpers/notification');

async function doChange(watchPath, filePath, repoName, username, email) {
  const loc = await getLoc(filePath);
  const basename = path.basename(watchPath);
  const extension = path.extname(filePath);
  const branch = (await getBranchName(watchPath)) || basename || 'NO_BRANCH';
  const data = {
    repo: repoName,
    branch,
    username,
    loc,
  };

  updateSkill({ username, extension });
  addActivity(data);
  addWorkingTime({ username });
  runTimekeeper(username);
}

const WATCHER_CONFIG = {
  ignored: /node_modules|(.*)\.log|(.*)\.json|dist|build|public|\.next/,
  persistent: true,
  // interval: 5 * 1000,
};

async function startStalking(watchPath, username, email) {
  try {
    const stalker = chokidar.watch(watchPath, WATCHER_CONFIG);
    let ready = false;
    let changeCounter = 0;
    let timer;

    const repoName = await getRepositoryName(watchPath);
    // username = username || (await getGitUserName(watchPath));
    email = email || (await getGitUserEmail(watchPath));

    stalker
      .on('ready', () => {
        ready = true;
        log.info('READY:', watchPath);
      })
      .on('change', async (path, stats) => {
        if (!ready) return;
        ++changeCounter;

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
          // You cannot editting 2 file at the same time
          if (changeCounter > 1) {
            return;
          }

          log.info(`CHANGING FILE: ${path}`);
          doChange(watchPath, path, repoName, username, email);
          changeCounter = 0;
        }, 250);
      });

    return stalker;
  } catch (error) {
    log.info('startStalking ERROR:', error);
  }
}

const run = (config) => {
  const watchPaths = config.path;
  const username = config.username;
  const email = config.email;

  runTimekeeper(username);

  // TODO: if all watch paths are configured from database
  // then we need close watcher to update new watchPaths
  const watcherInstants = [];
  const paths = [];

  log.info('TOTAL WATCHED PATHS:', watchPaths.length);
  for (let i = 0; i < watchPaths.length; i++) {
    const path = watchPaths[i];
    const instance = startStalking(path, username, email);

    paths.push(path);
    watcherInstants.push({
      path,
      instance,
    });
  }

  setTrayTooltip(`Hi ${username} ! running ....`);
  showNotice(`Agent start watching ${watchPaths.length} path: ${paths.join(' | ')}`);
};

exports.run = run;

// startStalking();
