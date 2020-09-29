let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

class EvalRuleConditionExceptionCommand {
  constructor() {
    this.flags = 'eval-rule-condition-exception';
    this.desc = '(Beta) Display evaluation rule conditions and exceptions.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    const myArgs = process.argv.slice(3);
    if (!myArgs[0]) {
      throw 'Missing rule Id.';
    }

    if (isNaN(myArgs[0])) {
      throw 'Invalid rule Id.';
    }

    options.ruleId = myArgs[0];
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
