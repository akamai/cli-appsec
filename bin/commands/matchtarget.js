let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class MatchTargetCommand {
  constructor() {
    this.flags = 'match-target';
    this.desc = '(Beta) Read a match target.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<match-target>', {
        paramsDesc: 'The match target ID.'
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
      });
  }

  run(options) {
    out.print({
      promise: new MatchTarget(options).getMatchTarget(),
      args: options,
      success: (args, data) => {
        let dataList = [];
        if (data.type == 'api') {
          data.apis.forEach(api => {
            dataList.push(api.id);
          });
        } else {
          if (data.hostnames && data.hostnames.length) {
            data.hostnames.forEach(hostname => {
              dataList.push(hostname);
            });
          } else {
            // If there are no "hostanames" in the response, that means "ALL_HOSTNAMES" is selected.
            dataList.push('ALL_HOSTNAMES');
          }
        }
        return dataList.join(require('os').EOL);
      }
    });
  }
}

module.exports = new MatchTargetCommand();
