let RecategorizedAkamaiDefinedBot = require('../../src/recategorizedakamaidefinedbot')
  .recategorizedakamaidefinedbot;
let out = require('./lib/out');

class ModifyRecategorizedAkamaiDefinedBotCommand {
  constructor() {
    this.flags = 'modify-recategorized-akamai-defined-bot';
    this.desc = 'Update existing recategorized akamai defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<akamai-defined-bot-id>', {
        paramsDesc: 'Akamai Defined Bot ID'
      })
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
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
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.akamai_defined_bot_id = options['akamai-defined-bot-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new RecategorizedAkamaiDefinedBot(options).updateRecategorizedAkamaiDefinedBot(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyRecategorizedAkamaiDefinedBotCommand();
