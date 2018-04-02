let CRB = require('../../src/crb').CRBHandler;

class CustomRuleTemplateCommand {
  constructor() {
    this.flags = 'structured-rule-template';
    this.desc = 'Prints sample JSON of a structured custom rule.';
    this.aliases = ['srt'];
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.usage('Usage: akamai-appsec structured-rule-template').help({
      includeGroups: false
    });
  }

  run(options) {
    console.log(new CRB(options).template());
  }
}

module.exports = new CustomRuleTemplateCommand();
