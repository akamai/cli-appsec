let PenaltyBox = require('../../src/penaltybox').penaltyBox;
let out = require('./lib/out');

class EnablePenaltyBoxCommand {
  constructor() {
    this.flags = 'enable-penalty-box';
    this.desc = '(Beta) Enable penalty box on the policy.';
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
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      })
      .string('--action <id>', {
        desc: 'Action to assign. ',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new PenaltyBox(options).enablePenaltyBox(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnablePenaltyBoxCommand();
