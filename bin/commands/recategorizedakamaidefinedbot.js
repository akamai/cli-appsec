let RecategorizedAkamaiDefinedBot = require('../../src/recategorizedakamaidefinedbot')
  .recategorizedakamaidefinedbot;
let out = require('./lib/out');

class RecategorizedAkamaiDefinedBotCommand {
  constructor() {
    this.flags = 'recategorized-akamai-defined-bot';
    this.desc = 'Display contents of recategorized akamai defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<akamai-defined-bot-id>', {
        paramsDesc: 'Akamai Defined Bot ID'
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
      });
  }

  run(options) {
    options.akamai_defined_bot_id = options['akamai-defined-bot-id'];

    out.print({
      promise: new RecategorizedAkamaiDefinedBot(options).getRecategorizedAkamaiDefinedBot(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RecategorizedAkamaiDefinedBotCommand();
