let out = require('./lib/out');
let Policy = require('../../src/policy').policy;

class PoliciesCommand {
  constructor() {
    this.flags = 'policies';
    this.desc = 'List all security policies.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Policy(options).policies(),
      args: options,
      objectType: 'policies',
      success: (args, data) => {
        let s = [];
        for (let i = 0; i < data.length; i++) {
          s.push(data[i].policyId);
        }
        return s.join(require('os').EOL);
      }
    });
  }
}

module.exports = new PoliciesCommand();
