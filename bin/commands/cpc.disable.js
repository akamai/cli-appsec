let CpcConfig = require('../../src/cpcconfig').cpcconfig;
let out = require('./lib/out');

class DisableCpcCommand {
  constructor() {
    this.flags = 'disable-cpc';
    this.desc = 'Disable Client-side Protection & Compliance on the security policy.';
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
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new CpcConfig(options).disableCpc(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new DisableCpcCommand();
