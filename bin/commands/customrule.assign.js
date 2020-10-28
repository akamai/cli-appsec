let CRB = require('../../src/crb').CRBHandler;
let out = require('./lib/out');

class ModifyCustomRuleCommand {
  constructor() {
    this.flags = 'enable-custom-rule';
    this.desc = 'Assigns an action (such as alert or deny) to an existing custom rule in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec enable-custom-rule --custom-rule <id> --action <action> [options]'
      )
      .number('--custom-rule <id>', {
        desc: 'Custom rule ID.',
        group: 'Required:',
        required: true
      })
      .string('--action <action>', {
        desc:
          "Action to assign. Use - \n\t\t      • 'alert': To record the trigger of the event; \n\t\t      • 'deny': To block the request; \n\t\t   • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t      • 'none': To disassociate with the policy;",
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
        desc: 'Policy ID. Mandatory if you have more than one policy.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new CRB(options).assign(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new ModifyCustomRuleCommand();
