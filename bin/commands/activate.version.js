let Activation = require('../../src/activation').activation;
let out = require('./lib/out');

class ActivateVersionCommand {
  constructor() {
    this.flags = 'activate';
    this.desc = 'Activate a version.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec activate --network <network> --notify <emails> [options]')
      .enumeration('--network <network>', {
        desc: 'The network in which the configuration must be activated.',
        choices: ['PRODUCTION', 'STAGING'],
        group: 'Required:',
        required: true
      })
      .stringArray('--notify <emails>', {
        desc: 'The comma separated email ids to get notification.',
        group: 'Required:',
        required: true
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
      .string('--note <note>', {
        desc: 'The activation notes.',
        group: 'Optional:',
        required: false
      })
      .stringArray('--acknowledge-invalid-hosts <invalid hostnames>', {
        desc:
          'In some cases, you may wish to activate a security configuration which targets hosts to which protection cannot be applied (for example, hosts not managed as Akamai properties). This will block activation with a warning, which will include the names of the invalid hosts. If you want to activate anyway, use this parameter to provide a comma-separated list of invalid host names to acknowledge the warning.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Activation(options).activate(),
      args: options,
      success: (args, data) => {
        return data.activationId;
      }
    });
  }
}

module.exports = new ActivateVersionCommand();
