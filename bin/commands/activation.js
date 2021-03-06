let out = require('./lib/out');
let Activation = require('../../src/activation').activation;

class ActivationStatusCommand {
  constructor() {
    this.flags = 'activation';
    this.desc = 'Get activation status.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec activation --activation-id <id> [options]')
      .number('--activation-id <id>', {
        desc: 'Activation request ID.',
        group: 'Required:',
        required: true
      })
      .boolean('--verbose', {
        desc: 'Provides more details about the activation status.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Activation(options).getStatus(),
      args: options,
      success: (args, data) => {
        if (args.verbose) {
          let nl = require('os').EOL;
          let result = 'Job ' + data.activationId + ' ' + data.status;
          result =
            result +
            nl +
            'Config: ' +
            data.activationConfigs[0].configId +
            ' Version: ' +
            data.activationConfigs[0].configVersion +
            ' ' +
            data.network;
          if (data.note) {
            result = result + nl + 'Note: ' + data.note;
          }
          if (data.notificationEmails && data.notificationEmails.length) {
            result = result + nl + 'Notify: ' + data.notificationEmails;
          }
          return result;
        } else {
          return data.status;
        }
      }
    });
  }
}

module.exports = new ActivationStatusCommand();
