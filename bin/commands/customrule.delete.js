let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class DeleteCustomRuleCommand {
  constructor() {
    this.flags = 'delete-custom-rule';
    this.desc = 'Delete a custom rule.';
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
      promise: new CRB(options).deleteRule(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteCustomRuleCommand();
