let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

const objectType = 'customRules';

class ListCustomRulesCommand {
  constructor() {
    this.flags = 'custom-rules';
    this.desc = 'List all custom rules.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration ID. Mandatory if you have more than one configuration.',
      group: 'Optional:',
      required: false
    });
  }
  run(options) {
    out.print({
      promise: new CRB(options).getAllRules(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(rule => {
          str.push(rule.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomRulesCommand();
