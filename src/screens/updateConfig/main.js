const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { log } = require('../../libs/log');

const configPath = path.join(__dirname, '../../../config');

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    width: 700,
    height: 750,
    // width: 400,
    // height: 350,
    devTools: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
};

ipcMain.handle('app:restart', () => {
  try {
    app.relaunch();
    app.exit(0);
  } catch (error) {
    log.info('app:restart ERROR', error);
    return error;
  }
});
ipcMain.handle('setting:get', () => {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config.path;
  } catch (error) {
    return '';
  }
});

ipcMain.handle('setting:set', (ev, data) => {
  try {
    let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.path = data;
    fs.writeFileSync(configPath, JSON.stringify(config));
    return true;
  } catch (error) {
    return false;
  }
});

app.on('ready', createWindow);

exports.openUpdateWindow = () => {
  win.loadURL(path.join(__dirname, './index.html'));
  win.once('ready-to-show', () => {
    win.show();
  });
};
