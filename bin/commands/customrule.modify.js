let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class ModifyCustomRuleCommand {
  constructor() {
    this.flags = 'modify-custom-rule';
    this.desc = 'Update existing custom rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec modify-custom-rule [required] [options]')
      .number('--custom-rule <id>', {
        desc: 'Rule ID.',
        group: 'Required:',
        required: true
      })
      .file('--file <path>', {
        desc: 'File with JSON rules',
        group: 'Required:',
        mustExist: true,
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
      promise: new CRB(options).updateRule(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}

module.exports = new ModifyCustomRuleCommand();
