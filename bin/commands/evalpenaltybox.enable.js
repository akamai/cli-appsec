let EvalPenaltyBox = require('../../src/evalpenaltybox').evalPenaltyBox;
let out = require('./lib/out');

class EnableEvalPenaltyBoxCommand {
  constructor() {
    this.flags = 'enable-eval-penalty-box';
    this.desc = 'Enable evaluation penalty box on the policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec enable-eval-penalty-box --action <action> [options]')
      .string('--action <action>', {
        desc:
          "Action to assign. Use - \n\t\t     • 'alert': To record the trigger of the event; \n\t\t     • 'deny': To block the request; \n\t\t       • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t     • 'none': To disassociate with the policy;",
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none]',
        required: true
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
      });
  }

  run(options) {
    out.print({
      promise: new EvalPenaltyBox(options).enablePenaltyBox(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableEvalPenaltyBoxCommand();
