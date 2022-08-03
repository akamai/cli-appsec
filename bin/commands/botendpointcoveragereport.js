let BotEndpointCoverageReport = require('../../src/botendpointcoveragereport')
  .botendpointcoveragereport;
let out = require('./lib/out');

class BotEndpointCoverageReportCommand {
  constructor() {
    this.flags = 'bot-endpoint-coverage-report';
    this.desc = 'Display contents of bot endpoint coverage report.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new BotEndpointCoverageReport(options).getBotEndpointCoverageReport(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new BotEndpointCoverageReportCommand();
