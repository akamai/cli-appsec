let CustomDefinedBot = require('../../src/customdefinedbot').customdefinedbot;
let out = require('./lib/out');

const objectType = 'bots';

class ListCustomDefinedBotCommand {
  constructor() {
    this.flags = 'custom-defined-bot-list';
    this.desc = 'List all custom defined bot.';
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
      });
  }
  run(options) {
    out.print({
      promise: new CustomDefinedBot(options).getCustomDefinedBotList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.botId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomDefinedBotCommand();
