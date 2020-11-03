let Version = require('../../src/versionsprovider').versionProvider;
let out = require('./lib/out');

class DeleteConfigVersionCommand {
  constructor() {
    this.flags = 'delete-config-version';
    this.desc = '(Beta) Delete a security config version.';
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
      .string('--version <num>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    //get args
    out.print({
      promise: new Version(options).deleteConfigVersion(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteConfigVersionCommand();
