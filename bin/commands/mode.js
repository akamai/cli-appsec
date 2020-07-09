let Mode = require('../../src/mode').mode;
let out = require('./lib/out');

class GetModeCommand {
  constructor() {
    this.flags = 'mode';
    this.desc = '(Beta) Display the WAF Mode';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--policy <id>', {
        desc: 'Security Policy ID.',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Mode(options).getMode(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new GetModeCommand();
