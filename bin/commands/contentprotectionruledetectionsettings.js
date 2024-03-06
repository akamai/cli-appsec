let ContentProtectionRule = require('../../src/contentprotectionrule').contentProtectionRule;
let out = require('./lib/out');

class ContentProtectionRuleDetectionSettingsCommand {
  constructor() {
    this.flags = 'content-protection-rule-detection-settings';
    this.desc = 'Display overridden detection settings of content protection rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<content-protection-rule-id>', {
        paramsDesc: 'Content protection rule ID'
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
    options.rule_id = options['content-protection-rule-id'];

    out.print({
      promise: new ContentProtectionRule(options).getContentProtectionRuleDetectionSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ContentProtectionRuleDetectionSettingsCommand();
