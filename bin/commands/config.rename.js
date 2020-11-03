let Config = require('../../src/configprovider').configProvider;
let out = require('./lib/out');

class RenameConfigCommand {
  constructor() {
    this.flags = 'rename-config';
    this.desc = '(Beta) Rename a security config.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
        .usage('Usage: akamai-appsec rename-config --name <name> [options]')
        .string('--name <name>', {
        desc: 'Name of the security config.',
        group: 'Required:',
        required: true
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--description <description>', {
        desc: 'Description of the security config.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    //get args
    out.print({
      promise: new Config(options).renameConfig(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new RenameConfigCommand();
