let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

class DisableEvalRuleCommand {
  constructor() {
    this.flags = 'disable-eval-rule-action';
    this.desc = 'Disable evaluation rule action in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<ruleId>', {
        paramsDesc: 'The rule ID.'
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
      promise: new EvalRules(options).disableEvalRuleAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new DisableEvalRuleCommand();
