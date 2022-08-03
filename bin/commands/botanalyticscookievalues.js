let BotAnalyticsCookieValues = require('../../src/botanalyticscookievalues')
  .botanalyticscookievalues;
let out = require('./lib/out');

class BotAnalyticsCookieValuesCommand {
  constructor() {
    this.flags = 'bot-analytics-cookie-values';
    this.desc = 'Display contents of bot analytics cookie values.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotAnalyticsCookieValues(options).getBotAnalyticsCookieValues(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotAnalyticsCookieValuesCommand();
