let Mode = require('../../src/mode').mode;
let out = require('./lib/out');

class SetModeCommand {
  constructor() {
    this.flags = 'set-mode';
    this.desc = '(Beta) Set the WAF Mode';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<mode>', {
        paramsDesc: 'The mode to be set to.'
      })
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
      promise: new Mode(options).setMode(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new SetModeCommand();
