let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class EnableMatchDataLoggingOverrideCommand {
  constructor() {
    this.flags = 'enable-override-match-data-logging';
    this.desc = 'Enable the Match Data Logging Override settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.',
        group: 'Required:',
        required: true
      })
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
        desc: 'Policy ID. Mandatory.',
        group: 'Required:',
        required: true
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');
    out.print({
      promise: new AdvancedSettings(options).enableMatchDataLoggingOverride(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableMatchDataLoggingOverrideCommand();
