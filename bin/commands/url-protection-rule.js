let URLProtection = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

const objectType = 'urlProtectionRule';

class URLProtectionRuleCommand {
  constructor() {
    this.flags = 'url-protection-rule';
    this.desc = 'Display a specific URL protection rule.';
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
      .number('--url-protection-rule <id>', {
        desc: 'URL Protection Rule ID.',
        group: 'Required:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new URLProtection(options).getURLProtectionRule(),
      args: options,
      objectType,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new URLProtectionRuleCommand();
