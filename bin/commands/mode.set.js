let Mode = require('../../src/mode').mode;
let out = require('./lib/out');

class SetModeCommand {
  constructor() {
    this.flags = 'set-mode';
    this.desc = 'Set the WAF Mode.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<mode>', {
        paramsDesc: 'The mode to be set to. Supported values are ASE_AUTO, ASE_MANUAL, AAG, KRS'
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
        desc: 'Security Policy ID.',
        group: 'Optional:',
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
