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
      .enumeration('--type <match-target-type>', {
        desc: 'Select whether to return API or Website match targets, if left blank, return both.',
        choices: ['api', 'website'],
        group: 'Optional:',
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
          targetSequence.push(matchTargets[i].targetId + ' ' + matchTargets[i].type);
        }
        return targetSequence.join(require('os').EOL);
      }
    });
  }
}

module.exports = new MatchTargetsCommand();
