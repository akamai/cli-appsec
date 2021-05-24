let Rules = require('../../src/rules').rules;
let out = require('./lib/out');

class RuleActionsCommand {
  constructor() {
    this.flags = 'krs-rules-upgrade';
    this.desc = 'Upgrade the KRS rules in a policy.';
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
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      })
      .string('--mode <id>', {
        desc:
          'Ruleset upgrade mode KRS2_AUTO or KRS2_MANUAL. If mode is not provided, KRS 1.0 ruleset is assumed',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new Rules(options).upgradeRules(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RuleActionsCommand();
