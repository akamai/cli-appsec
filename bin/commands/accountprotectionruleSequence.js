let AccountProtectionRuleSequence = require('../../src/accountprotectionrulesequence')
  .accountProtectionRuleSequence;
let out = require('./lib/out');

class GetAccountProtectionRuleSequenceCommand {
  constructor() {
    this.flags = 'get-account-protection-rule-sequence';
    this.desc = 'Get a sequence of account protected rule ids with in a security policy.';
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
      promise: new AccountProtectionRuleSequence(options).getAccountProtectionRuleSequence(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new GetAccountProtectionRuleSequenceCommand();
