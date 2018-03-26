let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class CreateCustomRuleCommand {
  constructor() {
    this.flags = 'create-custom-rule';
    this.desc = 'Create a custom rule.';
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
      .file('--file <path>', {
        desc: 'File with JSON rules',
        group: 'Options:',
        required: true,
        mustExist: true
      });
  }

  run(options) {
    out.print({
      promise: new CRB(options).createRule(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}

module.exports = new CreateCustomRuleCommand();
