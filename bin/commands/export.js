let Export = require('../../src/export').export;
let out = require('./lib/out');

class ExportCommand {
  constructor() {
    this.flags = 'export';
    this.desc = 'Export a configuration version.';
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
        desc: 'The version number to Export',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Export(options).export(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ExportCommand();
