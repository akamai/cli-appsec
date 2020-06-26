let AttackGroups = require('../../src/attackgroups').attackGroups;
let out = require('./lib/out');

class UpdateAGExceptionCommand {
  constructor() {
    this.flags = 'modify-attackgroup-condition-exception';
    this.desc = '(Beta) Modify attack group condition exception.';
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
    //get last 2 args
    const args = process.argv.slice(3, 5);

    if (!args[0]) {
      throw 'Missing ruleId.';
    }

    if (!args[1] || !args[1].startsWith('@')) {
      throw 'Missing file name.';
    }

    options.group = args[0];
    options.file = args[1].replace('@', '');

    out.print({
      promise: new AttackGroups(options).updateAttackGroupException(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new UpdateAGExceptionCommand();
