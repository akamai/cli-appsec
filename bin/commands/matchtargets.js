let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class MatchTargetsCommand {
  constructor() {
    this.flags = 'match-targets';
    this.desc = 'List all match targets.';
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
      });
  }

  run(options) {
    out.print({
      promise: new MatchTarget(options).matchtargets(),
      args: options,
      success: (args, data) => {
        let targetSequence = [];
        let matchTargets = data.matchTargets;
        for (let i = 0; i < matchTargets.length; i++) {
          targetSequence.push(matchTargets[i].targetId);
        }
        return targetSequence.join(require('os').EOL);
      }
    });
  }
}

module.exports = new MatchTargetsCommand();
