let CustomDefinedBot = require('../../src/customdefinedbot').customdefinedbot;
let out = require('./lib/out');

class ModifyCustomDefinedBotCommand {
  constructor() {
    this.flags = 'modify-custom-defined-bot';
    this.desc = 'Update existing custom defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<custom-defined-bot-id>', {
        paramsDesc: 'Custom Defined Bot ID'
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
    options.custom_defined_bot_id = options['custom-defined-bot-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new CustomDefinedBot(options).updateCustomDefinedBot(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyCustomDefinedBotCommand();
