let ActivationHistory = require('../../src/activationhistory').activationHistory;
let out = require('./lib/out');

const objectType = 'activationHistory';

class GetActivationHistoryCommand {
  constructor() {
    this.flags = 'activation-history';
    this.desc = 'List activation history for the configuration.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration ID. Mandatory if you have more than one configuration.',
      group: 'Optional:',
      required: false
    });
  }

  run(options) {
    out.print({
      promise: new ActivationHistory(options).getActivationHistory(),
      args: options,
      objectType,
      success: (args, data) => {
        let s = [];
        data[objectType].forEach(activation => {
          s.push(activation.activationId);
        });
        return s.join(require('os').EOL);
      }
    });
  }
}

module.exports = new GetActivationHistoryCommand();
