let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class EvasivePathMatchCommand {
  constructor() {
    this.flags = 'disable-evasive-path-match';
    this.desc = 'Disable Evasive Path Match.';
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
      })
      .string('--policy <id>', {
        desc: 'Policy ID. If not provided, we try to use the policy available on file.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new AdvancedSettings(options).updateEvasivePathMatch(false),
      args: options,
      success: (args, data) => {
        let enablePathMatch = data.enablePathMatch;
        let str = [];
        str.push(enablePathMatch);
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new EvasivePathMatchCommand();
