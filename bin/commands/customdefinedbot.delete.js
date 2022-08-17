let CustomDefinedBot = require('../../src/customdefinedbot').customdefinedbot;
let out = require('./lib/out');

class DeleteCustomDefinedBotCommand {
  constructor() {
    this.flags = 'delete-custom-defined-bot';
    this.desc = 'Delete a custom defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<custom-defined-bot-id>', {
        paramsDesc: 'Custom Defined Bot ID'
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
    options.custom_defined_bot_id = options['custom-defined-bot-id'];

    out.print({
      promise: new CustomDefinedBot(options).deleteCustomDefinedBot(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteCustomDefinedBotCommand();
