let BotDetection = require('../../src/botdetection').botdetection;
let out = require('./lib/out');

const objectType = 'detections';

class ListBotDetectionCommand {
  constructor() {
    this.flags = 'bot-detection-list';
    this.desc = 'List all bot detection.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotDetection(options).getBotDetectionList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.detectionId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListBotDetectionCommand();
