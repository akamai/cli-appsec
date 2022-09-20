let ChallengeAction = require('../../src/challengeaction').challengeaction;
let out = require('./lib/out');

class ChallengeActionCommand {
  constructor() {
    this.flags = 'challenge-action';
    this.desc = 'Display contents of challenge action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<action-id>', {
        paramsDesc: 'Challenge Action ID'
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
    options.action_id = options['action-id'];

    out.print({
      promise: new ChallengeAction(options).getChallengeAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ChallengeActionCommand();
