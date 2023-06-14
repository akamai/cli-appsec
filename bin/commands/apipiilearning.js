let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class GetApiPiiLearningCommand {
  constructor() {
    this.flags = 'api-pii-learning';
    this.desc = 'Display the API PII Learning settings.';
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
      promise: new AdvancedSettings(options).getApiPiiLearning(),
      args: options,
      success: (args, data) => {
        let enablePiiLearning = data.enablePiiLearning;
        let str = [];
        str.push(enablePiiLearning);
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new GetApiPiiLearningCommand();
