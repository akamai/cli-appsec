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
        desc: 'Match target id to move to the start.',
        group: 'Options:',
        required: false
      })
      .number('--append <id>', {
        desc: 'Match target id to move to the end.',
        group: 'Options:',
        required: false
      })
      .numberArray('--order <300,100,200>', {
        desc: 'The list of match target ids in desired order.',
        group: 'Options:',
        required: false
      })
      .check((argv, context) => {
        console.log(JSON.stringify(argv));
        let order = argv.order || argv._[0];
        if (!argv.insert && !argv.append && !order.length) {
          return context.cliMessage('Error: Specify an explicit order or append or insert option.');
        }
      });
  }

  run(options) {
    //consider the comma separated list of numbers as target ids if there is no explicit order param
    options.order = options.order || options._[0].split(',');
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
