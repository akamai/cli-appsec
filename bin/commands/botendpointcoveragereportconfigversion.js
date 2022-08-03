let BotEndpointCoverageReport = require('../../src/botendpointcoveragereport')
  .botendpointcoveragereport;
let out = require('./lib/out');

class BotEndpointCoverageReportConfigVersionCommand {
  constructor() {
    this.flags = 'bot-endpoint-coverage-report-config-version';
    this.desc = 'Display contents of bot endpoint coverage report - config version.';
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
      promise: new BotEndpointCoverageReport(options).getBotEndpointCoverageReportConfigVersion(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotEndpointCoverageReportConfigVersionCommand();
