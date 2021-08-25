let Tray = null;

exports.setTray = (tray) => {
  Tray = tray;
};

exports.setTrayTooltip = (tooltip) => {
  Tray.setToolTip(tooltip);
};
