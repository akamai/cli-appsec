let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;
let logger = require('../../src/constants').logger('modify-match-target');

const SUB_CPMMANDS = ['add-hostname'];
class ModifyMatchTargetCommand {
  constructor() {
    this.flags = 'modify-match-target';
    this.desc = 'Updates a match target.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<match-target>', {
        paramsDesc: 'The match target ID.'
      })
      .positional('<subcommand>', {
        paramsDesc: 'The subcommand. [' + SUB_CPMMANDS.join(',') + ']'
      })
      .positional('<hostname>', {
        paramsDesc: 'The hostname to add to the match target.'
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
      .check((argv, context) => {
        if (!SUB_CPMMANDS.includes(argv.subcommand)) {
          return context.cliMessage('Could not recognize the command: ' + argv.subcommand);
        }
      });
  }

  run(options) {
    logger.debug(JSON.stringify(options));
    options.hostnames = [options.hostname];
    out.print({
      promise: this._getOperation(options),
      args: options,
      success: (args, data) => {
        return data.targetId;
      }
    });
  }

  _getOperation(options) {
    switch (options.subcommand) {
      case 'add-hostname':
        return new MatchTarget(options).addHostnames();
      default:
        return null;
    }
  }
}

module.exports = new ModifyMatchTargetCommand();
