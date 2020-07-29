let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class DeleteRatePolicyCommand {
  constructor() {
    this.flags = 'delete-rate-policy';
    this.desc = '(Beta) Delete a rate policy.';
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
