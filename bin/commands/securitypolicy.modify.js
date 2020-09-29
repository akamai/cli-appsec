let SecurityPolicy = require('../../src/policy').policy;
let out = require('./lib/out');

class ModifySecurityPolicyCommand {
  constructor() {
    this.flags = 'modify-security-policy';
    this.desc = '(Beta) Update a security policy.';
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
      })
      .string('--name <id>', {
        desc: 'The name for policy.',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new SecurityPolicy(options).modifyPolicy(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifySecurityPolicyCommand();
