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
          for (let i = 0; i < data.apis.length; i++) {
            dataList.push(data.apis[i].id);
          }
        } else {
          for (let i = 0; i < data.hostnames.length; i++) {
            dataList.push(data.hostnames[i]);
          }
        }
        return dataList.join(require('os').EOL);
      }
    });
  }
}

module.exports = new MatchTargetCommand();
