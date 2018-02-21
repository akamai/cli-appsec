let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class CustomRuleCommand {
  constructor() {
    this.flags = 'custom-rule';
    this.desc = 'Display contents of custom rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .number('--custom-rule <id>', {
        desc: 'Rule ID.',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new CRB(options).getRule(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new CustomRuleCommand();