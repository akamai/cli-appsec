let out = require('./lib/out');
let Policy = require('../../src/policy').policy;

class PoliciesCommand {
  constructor() {
    this.flags = 'policies';
    this.desc = 'List all firewall policies.';
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
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Policy(options).policies(),
      args: options,
      success: (args, data) => {
        let s = [];
        for (let i = 0; i < data.policies.length; i++) {
          s.push(data.policies[i].policyId);
        }
        return s.join('\n');
      }
    });
  }
}

module.exports = new PoliciesCommand();
