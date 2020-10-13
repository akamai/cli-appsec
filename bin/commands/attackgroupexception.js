let AttackGroups = require('../../src/attackgroups').attackGroups;
let out = require('./lib/out');

class AttackGroupExceptionCommand {
  constructor() {
    this.flags = 'attackgroup-condition-exception';
    this.desc = '(Beta) Display attack group exceptions.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    const myArgs = process.argv.slice(3);

    if (myArgs[0]) {
      options.group = myArgs[0];
      out.print({
        promise: new AttackGroups(options).getAttackGroupException(),
        args: options,
        success: (args, data) => {
          return JSON.stringify(data);
        }
      });
    } else {
      throw 'Missing group name.';
    }
  }
}

module.exports = new AttackGroupExceptionCommand();
