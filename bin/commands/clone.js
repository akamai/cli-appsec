let Clone = require('../../src/clone').CloneHandler;
let out = require('./lib/out');

class CloneCommand {
  constructor() {
    this.flags = 'clone';
    this.desc = 'Clone a config.';
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
      .string('--version <num>', {
        desc: 'The version number to clone',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new Clone(options).clone(),
      args: options,
      success: (args, data) => {
        return data.version;
      }
    });
  }
}

module.exports = new CloneCommand();
