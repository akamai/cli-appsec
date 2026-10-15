let RapidRules = require('../../src/rapidrules').rapidRules;
let out = require('./lib/out');

class ModifyRapidRuleDefaultActionCommand {
  constructor() {
    this.flags = 'modify-rapid-rule-default-action';
    this.desc = 'Modify rapid rules default action in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('--action <action>', {
        desc:
          "Action to assign. Use - \n\t\t     • 'alert': To record the trigger of the event; \n\t\t     • 'deny': To block the request; \n\t\t       • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t     • 'none': To make the rule inactive in the policy; \n\t\t     • 'akamai_managed': To use the Akamai_managed action;",
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none, akamai_managed]',
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
      promise: new RapidRules(options).updateRapidRuleDefaultAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyRapidRuleDefaultActionCommand();
