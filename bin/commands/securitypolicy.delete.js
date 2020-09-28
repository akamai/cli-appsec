let SecurityPolicy = require('../../src/policy').policy;
let out = require('./lib/out');

class DeleteCustomRuleCommand {
  constructor() {
    this.flags = 'delete-security-policy';
    this.desc = 'Delete a security policy.';
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
      })
      .string('--policy <id>', {
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new SecurityPolicy(options).deletePolicy(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteCustomRuleCommand();
