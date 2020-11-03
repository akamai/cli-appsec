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
      .usage('Usage: akamai-appsec delete-custom-rule --custom-rule <id> [options]')
      .number('--custom-rule <id>', {
        desc: 'Custom rule ID.',
        group: 'Required:',
        required: true
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
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
