let AccountProtectionPolicySettings = require('../../src/accountprotectionpolicysettings')
  .accountProtectionPolicySettings;
let out = require('./lib/out');

class GetAccountProtectionSettingsCommand {
  constructor() {
    this.flags = 'account-protection-settings';
    this.desc = 'Display account protection settings for a security policy.';
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
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new AccountProtectionPolicySettings(options).getAccountProtectionSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new GetAccountProtectionSettingsCommand();
