let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class MatchDataLoggingCommand {
  constructor() {
    this.flags = 'match-data-logging';
    this.desc = 'Display the Match Data Logging settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory.',
        group: 'Required:',
        required: true
      })
      .string('--version <id>', {
        desc: 'Version Number. Mandatory.',
        group: 'Required:',
        required: true
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If provided, returns policy-level settings. If not provided, returns config-level settings.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new AdvancedSettings(options).getMatchDataLogging(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new MatchDataLoggingCommand();
