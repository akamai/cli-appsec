let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

class EvalRuleConditionExceptionCommand {
  constructor() {
    this.flags = 'eval-rule-condition-exception';
    this.desc = 'Display evaluation rule conditions and exceptions.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<ruleId>', {
        paramsDesc: 'Rule ID.'
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
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      })
      .check((argv, context) => {
        if (isNaN(argv['ruleId'])) {
          return context.cliMessage('ERROR: Invalid rule ID.');
        }
      });
  }
  run(options) {
    out.print({
      promise: new EvalRules(options).getEvalRuleConditionException(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EvalRuleConditionExceptionCommand();
