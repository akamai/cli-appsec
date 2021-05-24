let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class RatePolicyCommand {
  constructor() {
    this.flags = 'rate-policy';
    this.desc = 'Display contents of rate policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec rate-policy --rate-policy <id> [options]')
      .number('--rate-policy <id>', {
        desc: 'Rate Policy ID.',
        group: 'Required:',
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
      });
  }

  run(options) {
    //if rate policy id is provided without the parameter name, try to recognize it
    if (!options['rate-policy'] && options._ && !isNaN(options._[0])) {
      options['rate-policy'] = options._[0];
    }
    out.print({
      promise: new RatePolicy(options).getRatePolicy(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RatePolicyCommand();
