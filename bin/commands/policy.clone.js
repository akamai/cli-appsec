let out = require('./lib/out');
let Policy = require('../../src/policy').policy;

class PolicyCloneCommand {
  constructor() {
    this.flags = 'clone-policy';
    this.desc = 'Clone security policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<policy>', {
        paramsDesc: 'The policy id to be cloned.'
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
      })
      .string('--prefix <prefix>', {
        desc:
          'A 4 character alphanumeric prefix for the policy ID of the new security policy being created.',
        group: 'Options:',
        required: false
      })
      .string('--name <name>', {
        desc: 'Name of the security policy.',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Policy(options).clonePolicy(),
      args: options,
      success: (args, data) => {
        return data.policyId;
      }
    });
  }
}

module.exports = new PolicyCloneCommand();
