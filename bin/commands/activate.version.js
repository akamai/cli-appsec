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
          desc: 'Configuration id. Mandatory if you have more than one configuration.',
          group: 'Options:',
          required: false
        })
        .string('--version <id>', {
          desc:
              "The version number.",
          group: 'Options:',
          required: true
        })
        .string('--network <id>', {
          desc:
              "The network where this version will be activated, PROD or STAGING.",
          group: 'Options:',
          required: true
        })
  }

  run(options) {
    out.print({
      promise: new Activation(options).activate(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new ActivateVersionCommand();
