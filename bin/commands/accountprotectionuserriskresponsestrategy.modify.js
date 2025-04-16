let AccountProtectionAdvancedSettings = require('../../src/accountprotectionadvancedsettings')
  .accountProtectionAdvancedSettings;
let out = require('./lib/out');

class ModifyAccountProtectionUserRiskResponseStrategyCommand {
  constructor() {
    this.flags = 'modify-account-protection-user-risk-response-strategy';
    this.desc = 'Modify account protected advanced settings for user risk response strategy.';
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
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new AccountProtectionAdvancedSettings(options).updateUserRiskResponseStrategy(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyAccountProtectionUserRiskResponseStrategyCommand();
