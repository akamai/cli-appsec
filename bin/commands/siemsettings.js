let SiemSettings = require('../../src/siemsettings').siemSettings;
let out = require('./lib/out');

class siemSettingsCommand {
  constructor() {
    this.flags = 'siem';
    this.desc = '(Beta) Display the siem settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new SiemSettings(options).getSIEMSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new siemSettingsCommand();
