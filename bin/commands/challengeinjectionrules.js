let ChallengeInjectionRules = require('../../src/challengeinjectionrules').challengeinjectionrules;
let out = require('./lib/out');

class ChallengeInjectionRulesCommand {
  constructor() {
    this.flags = 'challenge-injection-rules';
    this.desc = 'Display contents of challenge injection rules.';
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
      promise: new ChallengeInjectionRules(options).getChallengeInjectionRules(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ChallengeInjectionRulesCommand();
