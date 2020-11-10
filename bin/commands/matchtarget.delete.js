let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class DeleteMatchTargetCommand {
  constructor() {
    this.flags = 'delete-match-target';
    this.desc = 'Delete a match target.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<match-target>', {
        paramsDesc: 'The match target ID.'
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
      });
  }

  run(options) {
    out.print({
      promise: new MatchTarget(options).deleteMatchTarget(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteMatchTargetCommand();
