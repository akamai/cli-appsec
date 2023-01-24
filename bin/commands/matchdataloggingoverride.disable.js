let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class MatchDataLoggingOverrideCommand {
  constructor() {
    this.flags = 'disable-override-match-data-logging';
    this.desc = 'Disable the Match Data Logging Override settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Required:',
        required: true
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Required:',
        required: true
      })
      .string('--policy <id>', {
        desc: 'Policy ID. If not provided, we try to use the policy available on file.',
        group: 'Required:',
        required: true
      });
  }
  run(options) {
    out.print({
      promise: new AdvancedSettings(options).disableMatchDataLoggingOverride(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new MatchDataLoggingOverrideCommand();
