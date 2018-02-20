let CRB = require('../../src/crb').CRBHandler;

class CustomRuleTemplateCommand {
  constructor() {
    this.flags = 'structured-rule-template';
    this.desc = 'Prints sample JSON of a structured custom rule.';
    this.aliases = ['srt'];
    this.run = this.run.bind(this);
  }

  run(options) {
    console.log(new CRB(options).template());
  }
}

module.exports = new CustomRuleTemplateCommand();
