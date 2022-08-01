let Recommendations = require('../../src/recommendations').recommendations;
let out = require('./lib/out');

class RecommendationsCommand {
  constructor() {
    this.flags = 'recommendations';
    this.desc = 'Display Recommendations';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('[attack-group-name-or-rule-id]', {
        paramsDesc: 'The attack group name or Rule Id.'
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
      })
      .string('--type <type>', {
        desc:
          'Recommendation Query Type (active|evaluation|all). If not provided, active recommendations fetched by default.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    options.group = isNaN(options['attack-group-name-or-rule-id'])
      ? options['attack-group-name-or-rule-id']
      : null;
    options.rule = options.group == null ? options['attack-group-name-or-rule-id'] : null;
    const promise =
      options.group != null
        ? new Recommendations(options).getGroupRecommendations()
        : options.rule != null
        ? new Recommendations(options).getRuleRecommendations()
        : new Recommendations(options).getRecommendations();
    out.print({
      promise,
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new RecommendationsCommand();
