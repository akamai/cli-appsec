let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class RatePolicyCommand {
  constructor() {
    this.flags = 'enable-rate-policy';
    this.desc = 'Assigns an action to an existing rate policy in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec enable-rate-policy --rate-policy <id> --ipv4-action <action> --ipv6-action <action> [options]'
      )
      .number('--rate-policy <id>', {
        desc: 'Rate Policy ID.',
        group: 'Required:',
        required: true
      })
      .string('--ipv4-action <action>', {
        desc:
          "IPv4 Action to assign. Use - \n\t\t\t  • 'alert': To record the trigger of the event;\n\t\t\t  • 'deny': To block the request; \n\t\t\t  • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t\t  • 'none': To disassociate with the policy;",
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none]',
        required: true
      })
      .string('--ipv6-action <action>', {
        desc:
          "IPv6 Action to assign. Use - \n\t\t\t  • 'alert': To record the trigger of the event;\n\t\t\t  • 'deny': To block the request; \n\t\t\t  • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t\t  • 'none': To disassociate with the policy;",
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
    //if rate policy id is provided without the parameter name, try to recognize it
    if (!options['rate-policy'] && options._ && !isNaN(options._[0])) {
      options['rate-policy'] = options._[0];
    }
    out.print({
      promise: new RatePolicy(options).enableRatePolicy(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RatePolicyCommand();
