let URLProtection = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

class DeleteURLProtectionRuleCommand {
  constructor() {
    this.flags = 'delete-url-protection-rule';
    this.desc = 'Delete a URL protection rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec delete-url-protection-rule --url-protection-policy <id> [options]'
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
      });
  }

  run(options) {
    out.print({
      promise: new URLProtection(options).deleteURLProtectionRule(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteURLProtectionRuleCommand();
