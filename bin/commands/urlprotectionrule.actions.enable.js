let urlProtectionRulesActions = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

const objectType = 'urlProtectionRuleActions';

class UrlProtectionRuleActionsEnableCommand {
  constructor() {
    this.flags = 'enable-url-protection-rule-actions';
    this.desc = 'Assigns actions to an existing url protection rule in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec enable-url-protection-rule-actions --url-protection-rule <id> --action <action> --load-shedding-action <action> [options]'
      )
      .number('--url-protection-rule <id>', {
        desc: 'Url Protection Rule ID.',
        group: 'Required:',
        required: true
      })
      .string('--action <action>', {
        desc:
          'The action to assign to this URL protection policy once the rate control threshold is reached.',
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none, challenge_{id}]',
        required: true
      })
      .string('--load-shedding-action <action>', {
        desc:
          'The action to assign to this URL protection policy once the intelligent load shedding threshold is reached.',
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none, challenge_{id}]',
        required: true
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
    out.print({
      promise: new urlProtectionRulesActions(options).enableURLProtectionRuleActions(),
      args: options,
      objectType,
      success: (args, data) => {
        if (data.policyId !== undefined) {
          data.urlProtectionRuleId = data.policyId;
          delete data.policyId;
        }
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new UrlProtectionRuleActionsEnableCommand();
