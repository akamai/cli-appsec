let AkamaiDefinedBot = require('../../src/akamaidefinedbot').akamaidefinedbot;
let out = require('./lib/out');

const objectType = 'bots';

class ListAkamaiDefinedBotCommand {
  constructor() {
    this.flags = 'akamai-defined-bot-list';
    this.desc = 'List all akamai defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new AkamaiDefinedBot(options).getAkamaiDefinedBotList(),
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

module.exports = new ListAkamaiDefinedBotCommand();
