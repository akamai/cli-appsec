let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

const objectType = 'evalRuleActions';

class EvalRuleActionsCommand {
  constructor() {
    this.flags = 'eval-rule-actions';
    this.desc = 'Display evaluation rules and actions in a policy.';
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
      });
  }
  run(options) {
    out.print({
      promise: new EvalRules(options).getEvalRulesActions(),
      args: options,
      objectType,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EvalRuleActionsCommand();
