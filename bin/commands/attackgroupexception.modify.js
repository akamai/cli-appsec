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
      .positional('<attack-group-id>', {
        paramsDesc: 'The attack group ID.'
      })
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
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
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }
  run(options) {
    options.group = options['attack-group-id'];
    options.file = options['@path'].replace('@', '');

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
