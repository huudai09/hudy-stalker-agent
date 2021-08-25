(async function () {
  const Setting = window.Setting;
  const App = window.App;

  const inpConfig = document.getElementById('inp-config');
  const btnSubmit = document.getElementById('btn-submit');

  const settings = await Setting.get();
  inpConfig.value = settings;

  btnSubmit.addEventListener('click', async () => {
    const value = inpConfig.value;
    if (!value) {
      alert('Config path is invalid');
      return;
    }

    const ret = await Setting.set(value.split(';').filter(Boolean).join(';'));

    if (!ret) {
      alert('error');
      return;
    }

    // ass

    App.restart();
  });
})();
