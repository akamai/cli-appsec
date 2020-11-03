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
      .usage('Usage: akamai-appsec modify-rate-policy <@path> --rate-policy <id> [options]')
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
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
      promise: new RatePolicy(options).updateRatePolicy(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}

module.exports = new ModifyRatePolicyCommand();
