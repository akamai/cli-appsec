let RecategorizedAkamaiDefinedBot = require('../../src/recategorizedakamaidefinedbot')
  .recategorizedakamaidefinedbot;
let out = require('./lib/out');

class DeleteRecategorizedAkamaiDefinedBotCommand {
  constructor() {
    this.flags = 'delete-recategorized-akamai-defined-bot';
    this.desc = 'Delete a recategorized akamai defined bot.';
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
      promise: new RecategorizedAkamaiDefinedBot(options).deleteRecategorizedAkamaiDefinedBot(),
      args: options,
      success: (args, data) => {
        return data.statusCode;
      }
    });
  }
}

module.exports = new DeleteRecategorizedAkamaiDefinedBotCommand();
