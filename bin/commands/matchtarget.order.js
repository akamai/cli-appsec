let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class MatchTargetOrderCommand {
  constructor() {
    this.flags = 'match-target-order';
    this.desc = 'Change the match target sequence.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id number',
        group: 'Options:',
        required: false
      })
      .string('--version <num>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .number('--insert <id>', {
        desc: 'Match target id to insert at the beginning.',
        group: 'Options:',
        required: false
      })
      .numberArray('--order <300,100,200>', {
        desc: 'The list of match target ids in desired order.',
        group: 'Options:',
        required: false
      })
      .check((argv, context) => {
        if (!argv.insert && argv.order.length == 0) {
          return context.cliMessage('Missing match target id parameters.');
        }
      });
  }

  run(options) {
    out.print({
      promise: new MatchTarget(options).changeSequence(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new MatchTargetOrderCommand();
