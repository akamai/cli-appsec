let RatePolicy = require('../../src/ratepolicy').ratePolicy;
let out = require('./lib/out');

class CreateRatePolicyCommand {
  constructor() {
    this.flags = 'create-rate-policy';
    this.desc = 'Create a rate rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
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
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');
    out.print({
      promise: new RatePolicy(options).createRatePolicy(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}
module.exports = new CreateRatePolicyCommand();
