let urlProtectionRulesActions = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

const objectType = 'urlProtectionRuleActions';

class UrlProtectionRuleActionsCommand {
  constructor() {
    this.flags = 'url-protection-rule-actions';
    this.desc = 'Display actions of a specific url protection rule.';
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
      promise: new urlProtectionRulesActions(options).getAllURLProtectionRulesActions(),
      args: options,
      objectType,
      success: (args, data) => {
        const matchingElement = data.urlProtectionActions.find(element => {
          return element.policyId === args['url-protection-rule'];
        });

        if (matchingElement) {
          return JSON.stringify(matchingElement);
        } else {
          throw `Please provide a valid url protection rule id.`;
        }
      }
    });
  }
}

module.exports = new UrlProtectionRuleActionsCommand();
