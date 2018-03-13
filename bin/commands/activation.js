let out = require('./lib/out');
let Activation = require('../../src/activation').activation;

class ActivationStatusCommand {
  constructor() {
    this.flags = 'activation';
    this.desc = 'Get activation status.';
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
        .number('--config <id>', {
          desc: 'Configuration id. Mandatory if you have more than one configuration.',
          group: 'Options:',
          required: false
        })
        .number('--activation-id <id>', {
          desc: 'Activation request id.',
          group: 'Options:',
          required: true
        });
  }

  run(options) {
    out.print({
      promise: new Activation(options).getStatus(),
      args: options,
       success: (args, data) => {
          return data.status;
       }
    });
  }
}

module.exports = new ActivationStatusCommand();
