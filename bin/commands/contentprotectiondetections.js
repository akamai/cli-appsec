let ContentProtectionRule = require('../../src/contentprotectionrule').contentProtectionRule;
let out = require('./lib/out');

class ContentProtectionRuleDetectionsCommand {
  constructor() {
    this.flags = 'content-protection-detections';
    this.desc = 'Display content protection detections.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new ContentProtectionRule(options).getContentProtectionDetections(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ContentProtectionRuleDetectionsCommand();
