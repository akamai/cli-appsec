let ContentProtectionRule = require('../../src/contentprotectionrule').contentProtectionRule;
let out = require('./lib/out');

class ContentProtectionRuleDetectionsCommand {
  constructor() {
    this.flags = 'content-protection-rule-detections';
    this.desc = 'Display content protection rule detections.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new ContentProtectionRule(options).getContentProtectionRuleDetections(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.categoryId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ContentProtectionRuleDetectionsCommand();
