let ContentProtectionJavaScriptInjectionRule = require('../../src/contentprotectionjavascriptinjectionrule')
  .contentProtectionJavaScriptInjectionRule;
let out = require('./lib/out');

class ContentProtectionJavaScriptInjectionRuleListCommand {
  constructor() {
    this.flags = 'content-protection-javascript-injection-rule-list';
    this.desc = 'Display contents of content protection javascript injection rules.';
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
      promise: new ContentProtectionJavaScriptInjectionRule(
        options
      ).getContentProtectionJavaScriptInjectionRules(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ContentProtectionJavaScriptInjectionRuleListCommand();
