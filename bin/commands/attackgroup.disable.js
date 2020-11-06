let AttackGroups = require('../../src/attackgroups').attackGroups;
let out = require('./lib/out');

class DisableAttackGroupCommand {
  constructor() {
    this.flags = 'disable-attack-group';
    this.desc = '(Beta) Disable attack group.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<attack-group-name>', {
        paramsDesc: 'The attack group name.'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:'
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:'
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:'
      });
  }

  run(options) {
    options.group = options['attack-group-name'];
    out.print({
      promise: new AttackGroups(options).disableAttackGroup(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new DisableAttackGroupCommand();
