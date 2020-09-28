let SecurityPolicy = require('../../src/policy').policy;
let out = require('./lib/out');

class CreateSecurityPolicyCommand {
  constructor() {
    this.flags = 'create-security-policy';
    this.desc = '(Beta) Create a security policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
      })
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
    //get args
    const args = process.argv.slice(3, 5);

    if (!args[0] || !args[0].startsWith('@')) {
      throw 'Missing file name.';
    }
    options.file = args[0].replace('@', '');

    out.print({
      promise: new SecurityPolicy(options).createPolicy(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CreateSecurityPolicyCommand();
