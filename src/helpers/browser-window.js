let Win = null;
exports.setBrowserWindow = (window) => {
  Win = window;
};

exports.openBrowserWindow = (url) => {
  Win.loadURL(url);
  Win.once('ready-to-show', () => {
    Win.show();
  });

  // Win.show();
};

exports.hideBrowserWindow = () => {
  Win.hide();
};
