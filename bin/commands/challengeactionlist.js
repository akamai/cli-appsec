let ChallengeAction = require('../../src/challengeaction').challengeaction;
let out = require('./lib/out');

const objectType = 'challengeActions';

class ListChallengeActionCommand {
  constructor() {
    this.flags = 'challenge-action-list';
    this.desc = 'List all challenge action.';
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
      });
  }
  run(options) {
    out.print({
      promise: new ChallengeAction(options).getChallengeActionList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.actionId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListChallengeActionCommand();
