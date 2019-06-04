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
      .number('--config <id>', {
        desc: 'Configuration id.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc: 'The version number.',
        group: 'Options:',
        required: false
      })
      .enumeration('--network <network>', {
        desc: 'The network in which the configuration must be activated.',
        choices: ['PRODUCTION', 'STAGING'],
        required: true
      })
      .string('--note <note>', {
        desc: 'The activation notes.',
        group: 'Options:',
        required: false
      })
      .stringArray('--notify <emails>', {
        desc: 'The comma separated email ids to get notification.',
        group: 'Options:',
        required: true
      })
      .stringArray('--acknowledge-invalid-hosts <invalid hostnames>', {
        desc:
          'A comma separated list of domains or subdomains that are listed in this configuration as protected, but which cannot be protected for some reason (for example, they are not managed by Akamai). If a previous activation response required you to acknowledge a list of invalid hosts, you can do so here.',
        group: 'Options:',
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
