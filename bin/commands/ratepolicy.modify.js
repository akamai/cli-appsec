let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class ModifyRatePolicyCommand {
  constructor() {
    this.flags = 'modify-rate-policy';
    this.desc = '(Beta) Update existing rate policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
      })
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
    const myArgs = process.argv.slice(2);
    if (myArgs[1].startsWith('@')) {
      options.file = myArgs[1].replace('@', '');
      out.print({
        promise: new RatePolicy(options).updateRatePolicy(),
        args: options,
        success: (args, data) => {
          return data.id;
        }
      });
    } else {
      throw 'Missing input file path.';
    }
  }
}

module.exports = new ModifyRatePolicyCommand();
