let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class DeleteRatePolicyCommand {
  constructor() {
    this.flags = 'delete-rate-policy';
    this.desc = 'Delete a rate policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec delete-rate-policy --rate-policy <id> [options]')
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
    out.print({
      promise: new RatePolicy(options).deleteRatePolicy(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteRatePolicyCommand();
