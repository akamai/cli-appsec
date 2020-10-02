let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

class EnableEvalRuleCommand {
  constructor() {
    this.flags = 'enable-eval-rule-action';
    this.desc = '(Beta) Enable evaluation rule action in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<ruleId>', {
        paramsDesc: 'The rule id.'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      })
      .string('--action <id>', {
        desc: 'Action to assign. ',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new EvalRules(options).enableEvalRuleAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableEvalRuleCommand();
