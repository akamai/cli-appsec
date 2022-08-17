let BotAnalyticsCookieRotateValues = require('../../src/botanalyticscookierotatevalues')
  .botanalyticscookierotatevalues;
let out = require('./lib/out');

class RotateBotAnalyticsCookieValuesCommand {
  constructor() {
    this.flags = 'rotate-bot-analytics-cookie-values';
    this.desc = 'Rotate bot analytics cookie values.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotAnalyticsCookieRotateValues(options).rotateBotAnalyticsCookieValues(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RotateBotAnalyticsCookieValuesCommand();
