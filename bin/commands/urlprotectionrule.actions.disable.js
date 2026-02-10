let urlProtectionRulesActions = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

const objectType = 'urlProtectionRuleActions';

class UrlProtectionRuleActionsDisableCommand {
  constructor() {
    this.flags = 'disable-url-protection-rule-actions';
    this.desc = 'Removes an action set to an existing url protection rule in a policy.';
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
      })
      .number('--url-protection-rule <id>', {
        desc: 'Url Protection Rule ID. Mandatory if you have more than one url protection rule.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new urlProtectionRulesActions(options).disableURLProtectionRuleActions(),
      args: options,
      objectType,
      success: (args, data) => {
        if (data.policyId !== undefined) {
          data.urlProtectionRule = data.policyId;
          delete data.policyId;
        }
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new UrlProtectionRuleActionsDisableCommand();
