let Rules = require('../../src/rules').rules;
let out = require('./lib/out');

class EnableRuleCommand {
  constructor() {
    this.flags = 'enable-rule-action';
    this.desc = 'Enable rule action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec enable-rule-action <ruleId> --action <action> [options]')
      .positional('<ruleId>', {
        paramsDesc: 'Rule ID.'
      })
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
      })
      .check((argv, context) => {
        if (isNaN(argv['ruleId'])) {
          return context.cliMessage('ERROR: Invalid rule ID.');
        }
      });
  }

  run(options) {
    out.print({
      promise: new Rules(options).enableRuleAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableRuleCommand();
