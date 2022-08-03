let AkamaiDefinedBot = require('../../src/akamaidefinedbot').akamaidefinedbot;
let out = require('./lib/out');

class AkamaiDefinedBotCommand {
  constructor() {
    this.flags = 'akamai-defined-bot';
    this.desc = 'Display contents of akamai defined bot.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.positional('<bot-id>', {
      paramsDesc: 'Akamai Defined Bot ID'
    });
  }

  run(options) {
    options.bot_id = options['bot-id'];

    out.print({
      promise: new AkamaiDefinedBot(options).getAkamaiDefinedBot(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new AkamaiDefinedBotCommand();
