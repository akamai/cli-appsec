let AccountProtectionAdvancedSettings = require('../../src/accountprotectionadvancedsettings')
  .accountProtectionAdvancedSettings;
let out = require('./lib/out');

class GetAccountProtectionUserAllowListIdCommand {
  constructor() {
    this.flags = 'account-protection-user-allow-list-id';
    this.desc = 'Display user allow list id for account protection.';
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
      promise: new AccountProtectionAdvancedSettings(options).getUserAllowListId(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new GetAccountProtectionUserAllowListIdCommand();
