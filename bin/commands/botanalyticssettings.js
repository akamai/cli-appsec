let BotAnalyticsSettings = require('../../src/botanalyticssettings').botanalyticssettings;
let out = require('./lib/out');

class BotAnalyticsSettingCommand {
  constructor() {
    this.flags = 'bot-analytics-settings';
    this.desc = 'Display contents of bot analytics settings.';
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
      promise: new BotAnalyticsSettings(options).getBotAnalyticsSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotAnalyticsSettingCommand();
