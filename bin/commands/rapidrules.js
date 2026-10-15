let RapidRules = require('../../src/rapidrules').rapidRules;
let out = require('./lib/out');

const objectType = 'policyRules';

class RapidRulesCommand {
  constructor() {
    this.flags = 'rapid-rules';
    this.desc = 'Display all rapid rules in a policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .boolean('--include-expiry-details', {
        desc: 'Include expiry details (expired, expireInDays) in the response.',
        group: 'Optional:',
        required: false
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
    out.print({
      promise: new RapidRules(options).getRapidRules(),
      args: options,
      objectType,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RapidRulesCommand();
