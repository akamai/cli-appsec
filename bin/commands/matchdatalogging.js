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
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
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
        let enabled = data.enabled;
        let requestBody = data.requestBody;
        let responseBody = data.responseBody;
        let str = [];

        if (enabled) {
          str.push('enabled');
        }

        if (requestBody) {
          str.push('requestBody');
        }
        str.push(requestBody);

        if (responseBody) {
          str.push('responseBody');
        }
        str.push(responseBody);

        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new MatchDataLoggingCommand();
