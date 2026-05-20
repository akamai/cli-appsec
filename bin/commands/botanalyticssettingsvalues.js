let BotAnalyticsSettingsValues = require('../../src/botanalyticssettingsvalues')
  .botanalyticssettingsvalues;
let out = require('./lib/out');

class BotAnalyticsSettingsValuesCommand {
  constructor() {
    this.flags = 'bot-analytics-settings-values';
    this.desc = 'Display contents of bot analytics settings values.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotAnalyticsSettingsValues(options).getBotAnalyticsSettingsValues(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotAnalyticsSettingsValuesCommand();
