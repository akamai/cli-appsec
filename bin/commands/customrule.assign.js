let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class ModifyCustomRuleCommand {
  constructor() {
    this.flags = 'enable-custom-rule';
    this.desc = 'Assigns an action (such as alert or deny) to an existing custom rule in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--custom-rule <id>', {
        desc: 'Rule ID.',
        group: 'Options:',
        required: true
      })
      .string('--policy <id>', {
        desc: 'Policy ID.',
        group: 'Options:',
        required: true
      })
      .string('--action <id>', {
        desc: 'Action to assign.',
        group: 'Options:',
        required: true
      })
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <num>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new CRB(options).assign(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new ModifyCustomRuleCommand();
