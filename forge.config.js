const fs = require('fs');
const path = require('path');
module.exports = {
  packagerConfig: {
    ignore: '(.*)\\.log|(.*)\\.git(.*)|(.*)\\.prettier(.*)',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'HudyAgent',
        iconUrl: __dirname + '/icon.ico',
        setupIcon: __dirname + '/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  hooks: {
    postPackage: async (forgeConfig, options) => {
      if (options.spinner) {
        const configFile = path.join(options.outputPaths[0], 'resources/app/config');
        const testFolder = path.join(options.outputPaths[0], 'resources/app/test');
        const exist = fs.existsSync(configFile);
        const existTestFolder = fs.existsSync(testFolder);

        if (exist) {
          fs.unlinkSync(configFile);
          options.spinner.info(`Deleted file ${configFile}`);
        }
        if (existTestFolder) {
          fs.rmdirSync(testFolder, { recursive: true });
          options.spinner.info(`Deleted folder ${testFolder}`);
        }
      }
    },
  },
};
