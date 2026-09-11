let BotAnalyticsSettings = require('../../src/botanalyticssettings').botanalyticssettings;
let out = require('./lib/out');

class ModifyBotAnalyticsSettingsCommand {
  constructor() {
    this.flags = 'modify-bot-analytics-settings';
    this.desc = 'Update existing bot analytics settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
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
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.bot_analytics_settings_id = options['bot-analytics-settings-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new BotAnalyticsSettings(options).updateBotAnalyticsSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyBotAnalyticsSettingsCommand();
