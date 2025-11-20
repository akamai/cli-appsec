let AccountProtectionRules = require('../../src/accountprotectionrules').accountProtectionRules;
let out = require('./lib/out');

class DeleteAccountProtectionRuleCommand {
  constructor() {
    this.flags = 'delete-account-protection-rule';
    this.desc = 'Delete account protection rule with in a security policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<rule-id>', {
        paramsDesc: 'Rule ID'
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
    options.rule_id = options['rule-id'];

    out.print({
      promise: new AccountProtectionRules(options).deleteAccountProtectionRule(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteAccountProtectionRuleCommand();
