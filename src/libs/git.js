const git = require('simple-git');

exports.getRepositoryName = (watchPath) => {
  return new Promise((resolve) => {
    const commands = ['config', '--get', 'remote.origin.url'];

    git(watchPath).raw(commands, (err, result) => {
      if (err) return;

      const lastBacksplash = result.lastIndexOf('/');
      const repoName = result.slice(lastBacksplash + 1, result.length).trim();

      resolve(repoName);
    });
  });
};

exports.getGitUserName = (watchPath) => {
  return new Promise((resolve) => {
    const commands = ['config', '--get', 'user.name'];

    git(watchPath).raw(commands, (err, result) => {
      if (err) {
        resolve('');
        return;
      }

      resolve(result);
    });
  });
};

exports.getGitUserEmail = (watchPath) => {
  return new Promise((resolve) => {
    const commands = ['config', '--get', 'user.email'];

    git(watchPath).raw(commands, (err, result) => {
      if (err) {
        resolve('');
        return;
      }

      resolve(result);
    });
  });
};

exports.getBranchName = (watchPath) => {
  return new Promise((resolve) => {
    git(watchPath).branch((err, result) => {
      if (err) {
        resolve('');
        return;
      }
      const branch = result.current;
      resolve(branch.replace(/\//g, '__').trim());
    });
  });
};
