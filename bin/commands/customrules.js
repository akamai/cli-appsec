let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class ListCustomRulesCommand {
  constructor() {
    this.flags = 'custom-rules';
    this.desc = 'List all custom rules.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration id. Mandatory if you have more than one configuration.',
      group: 'Options:',
      required: false
    });
  }
  run(options) {
    out.print({
      promise: new CRB(options).getAllRules(),
      args: options,
      success: (args, data) => {
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].ruleId);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomRulesCommand();
