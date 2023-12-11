let ContentProtectionRule = require('../../src/contentprotectionrule').contentProtectionRule;
let out = require('./lib/out');

const objectType = 'operations';

class ListContentProtectionRuleCommand {
  constructor() {
    this.flags = 'content-protection-rule-list';
    this.desc = 'List all content protection rules.';
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
      promise: new ContentProtectionRule(options).getContentProtectionRuleList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(rule => {
          str.push(rule.ruleId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListContentProtectionRuleCommand();
