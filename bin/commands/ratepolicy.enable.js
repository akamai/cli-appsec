let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class RatePolicyCommand {
  constructor() {
    this.flags = 'enable-rate-policy';
    this.desc = '(Beta) Assigns an action to an existing rate policy in a policy.';
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
      .number('--rate-policy <id>', {
        desc: 'Rate Policy ID.',
        group: 'Options:',
        required: true
      })
      .string('--policy <id>', {
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      })
      .string('--ipv4-action <id>', {
        desc:
          'IPV4 Action to assign. If the action is "none", it is not associated with the policy.',
        group: 'Options:',
        required: true
      })
      .string('--ipv6-action <id>', {
        desc:
          'IPV6 Action to assign. If the action is "none", it is not associated with the policy.',
        group: 'Options:',
        required: true
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
