let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class EnableMatchDataLoggingCommand {
  constructor() {
    this.flags = 'enable-match-data-logging';
    this.desc = 'Enable the Match Data Logging settings.';
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
      });
  }
  run(options) {
    out.print({
      promise: new AdvancedSettings(options).enableMatchDataLogging(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableMatchDataLoggingCommand();
