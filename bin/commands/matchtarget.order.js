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
      .number('--insert <id>', {
        desc: 'Match target ID to move to the start.',
        group: 'Optional:',
        required: false
      })
      .number('--append <id>', {
        desc: 'Match target ID to move to the end.',
        group: 'Optional:',
        required: false
      })
      .positional('[order]', {
        params: [
          {
            desc: 'The comma separated list of numeric match target IDs in the desired order.',
            type: 'array:number'
          }
        ]
      })
      .check((argv, context) => {
        //console.log(JSON.stringify(argv));
        if (!argv.insert && !argv.append && !argv.order[0]) {
          return context.cliMessage('Error: Specify an explicit order or append or insert option.');
        }
        let paramCount = 0;
        if (argv.insert) {
          paramCount++;
        }
        if (argv.append) {
          paramCount++;
        }
        if (argv.order && argv.order[0]) {
          paramCount++;
        }
        if (paramCount > 1) {
          return context.cliMessage('Error: Specify any one of order or append or insert option.');
        }
      });
  }

  run(options) {
    //consider the comma separated list of numbers as target ids.
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
