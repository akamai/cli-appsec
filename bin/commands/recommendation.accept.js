let Recommendations = require('../../src/recommendations').recommendations;
let out = require('./lib/out');

class RecommendationsCommand {
  constructor() {
    this.flags = 'accept-recommendation';
    this.desc = 'Accept Recommendation';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec accept-recommendation --selector <selectorId> [options]')
      .number('--selector <selectorId>', {
        desc: 'Selector ID',
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

      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    options.action = 'ACCEPT';
    options.selectorId = options['selector'];

    out.print({
      promise: new Recommendations(options).postRecommendation(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RecommendationsCommand();
