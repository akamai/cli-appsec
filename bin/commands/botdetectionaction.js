let BotDetectionAction = require('../../src/botdetectionaction').botdetectionaction;
let out = require('./lib/out');

class BotDetectionActionCommand {
  constructor() {
    this.flags = 'bot-detection-action';
    this.desc = 'Display contents of bot detection action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<bot-detection-id>', {
        paramsDesc: 'Bot Detection ID'
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
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    options.bot_detection_id = options['bot-detection-id'];

    out.print({
      promise: new BotDetectionAction(options).getBotDetectionAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotDetectionActionCommand();
