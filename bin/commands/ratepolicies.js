let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

const objectType = 'ratePolicies';
class ListRatePoliciesCommand {
  constructor() {
    this.flags = 'rate-policies';
    this.desc = 'List all rate policies.';
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
      });
  }
  run(options) {
    out.print({
      promise: new RatePolicy(options).getAllRatePolicies(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(ratePolicy => {
          str.push(ratePolicy.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListRatePoliciesCommand();
