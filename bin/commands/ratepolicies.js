let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class ListRatePoliciesCommand {
  constructor() {
    this.flags = 'rate-policies';
    this.desc = '(Beta) List all rate policies.';
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
      });
  }
  run(options) {
    out.print({
      promise: new RatePolicy(options).getAllRatePolicies(),
      args: options,
      success: (args, data) => {
        data = data.ratePolicies;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListRatePoliciesCommand();
