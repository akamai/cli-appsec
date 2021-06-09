let EvalRules = require('../../src/evalrules').evalrules;
let out = require('./lib/out');

class EnableEvalRuleCommand {
  constructor() {
    this.flags = 'start-eval';
    this.desc = 'Start evaluation in a policy.';
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
        .string('--mode <mode>', {
          desc:
              'Evaluation mode  KRS2_AUTO or KRS2_MANUAL. Used only for ASE(KRS 2) evaluation rulesets. Defaults to KRS2_MANUAL',
          group: 'Optional:',
          required: false
        })
     ;
  }

  run(options) {
    options.mode = options['mode'];

    out.print({
      promise: new EvalRules(options).startEval(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableEvalRuleCommand();
