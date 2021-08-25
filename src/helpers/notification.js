const { Notification } = require('electron');
const path = require('path');
const NOTIFICATION_TITLE = 'HudyAgent Notification';

const iconPath = path.join(__dirname, '../icon-48.png');

function showNotification(message) {
  new Notification({ title: NOTIFICATION_TITLE, body: message, icon: iconPath }).show();
}

exports.showNotice = (message) => {
  showNotification(message);
};
