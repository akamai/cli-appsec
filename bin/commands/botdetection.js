let BotDetection = require('../../src/botdetection').botdetection;
let out = require('./lib/out');

class BotDetectionCommand {
  constructor() {
    this.flags = 'bot-detection';
    this.desc = 'Display contents of bot detection.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.positional('<bot-detection-id>', {
      paramsDesc: 'Bot Detection ID'
    });
  }

  run(options) {
    options.bot_detection_id = options['bot-detection-id'];

    out.print({
      promise: new BotDetection(options).getBotDetection(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotDetectionCommand();
