let ContentProtectionJavaScriptInjectionRule = require('../../src/contentprotectionjavascriptinjectionrule')
  .contentProtectionJavaScriptInjectionRule;
let out = require('./lib/out');

class ModifyContentProtectionJavaScriptInjectionRulesCommand {
  constructor() {
    this.flags = 'modify-content-protection-javascript-injection-rule';
    this.desc = 'Update content protection JavaScript injection rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<content-protection-javascript-injection-rule-id>', {
        paramsDesc: 'Content protection JavaScript injection rule ID'
      })
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
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
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.rule_id = options['content-protection-javascript-injection-rule-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new ContentProtectionJavaScriptInjectionRule(
        options
      ).updateContentProtectionJavaScriptInjectionRule(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyContentProtectionJavaScriptInjectionRulesCommand();
