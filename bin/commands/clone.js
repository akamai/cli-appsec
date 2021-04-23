let Clone = require('../../src/clone').CloneHandler;
let out = require('./lib/out');

class CloneCommand {
  constructor() {
    this.flags = 'clone';
    this.desc = 'Clone a config version.';
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
          "Version number to clone. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'.",
        group: 'Optional:',
        required: false
      })
      .boolean('--rule-update', {
        desc:
          'Specify whether the cloned config version should have updated rule-set. Defaults to false.',
        group: 'Optional:',
        required: false
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
