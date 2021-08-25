const { app, Tray, Menu, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');
const { start } = require('./main');
const { setTray } = require('./helpers/tray');
const { setBrowserWindow } = require('./helpers/browser-window');
const { openUpdateWindow } = require('./screens/updateConfig/main');

const iconPath = path.join(__dirname, 'icon-32.png');
let appIcon = null;
let win = null;

const server = `https://test-tau-rose.vercel.app`;
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({ url });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

const createWindow = () => {
  win = new BrowserWindow({ show: false, width: 800, height: 600, devTools: false, autoHideMenuBar: true });
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Setting',
      click: () => {
        openUpdateWindow();
      },
    },
    {
      label: 'Restart',
      click: () => {
        app.relaunch();
        app.exit(0);
      },
    },
    {
      label: 'Quit',
      // accelerator: 'Command+Q',
      click: () => {
        app.quit();
      },
      selector: 'terminate:',
    },
  ]);

  appIcon.setToolTip('HudyAgent verifying..... 1.0.1');
  appIcon.setContextMenu(contextMenu);

  setBrowserWindow(win);
  setTray(appIcon);
  start();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
