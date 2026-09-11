let BotAnalyticsSettingsRotateValues = require('../../src/botanalyticssettingsrotatevalues')
  .botanalyticssettingsrotatevalues;
let out = require('./lib/out');

class RotateBotAnalyticsSettingsValuesCommand {
  constructor() {
    this.flags = 'rotate-bot-analytics-settings-values';
    this.desc = 'Rotate bot analytics settings values.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotAnalyticsSettingsRotateValues(options).rotateBotAnalyticsSettingsValues(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RotateBotAnalyticsSettingsValuesCommand();
