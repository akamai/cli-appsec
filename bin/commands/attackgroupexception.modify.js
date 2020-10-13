let AttackGroups = require('../../src/attackgroups').attackGroups;
let out = require('./lib/out');

class AttackGroupExceptionModifyCommand {
  constructor() {
    this.flags = 'modify-attackgroup-condition-exception';
    this.desc = '(Beta) Update attack group exceptions.';
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
    //get last 2 args
    const args = process.argv.slice(3, 5);

    if (args[0]) {
      options.group = args[0];
    } else {
      throw 'Missing group name.';
    }

    if (!args[1] || !args[1].startsWith('@')) {
      throw 'Missing file name.';
    }

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

module.exports = new AttackGroupExceptionModifyCommand();
