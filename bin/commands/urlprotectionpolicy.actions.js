let urlProtectionPoliciesActions = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

class UrlProtectionPolicyActionsCommand {
  constructor() {
    this.flags = 'url-protection-policy-actions';
    this.desc = 'Display actions of a specific url protection policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec url-protection-policy-actions --url-protection-policy <id> [options]'
      )
      .number('--url-protection-policy <id>', {
        desc: 'URL Protection Policy ID.',
        group: 'Required:',
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
      promise: new urlProtectionPoliciesActions(options)
        .getAllURLProtectionPoliciesActions()
        .then(data => {
          const matchingElement = data.urlProtectionActions.find(element => {
            return String(element.policyId) === String(options['url-protection-policy']);
          });

          if (!matchingElement) {
            throw 'The requested url protection policy does not exist.';
          }

          return matchingElement;
        }),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new UrlProtectionPolicyActionsCommand();
