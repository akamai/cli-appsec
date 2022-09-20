let CustomClient = require('../../src/customclient').customclient;
let out = require('./lib/out');

class CustomClientCommand {
  constructor() {
    this.flags = 'custom-client';
    this.desc = 'Display contents of custom client.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<custom-client-id>', {
        paramsDesc: 'Custom Client ID'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    options.custom_client_id = options['custom-client-id'];

    out.print({
      promise: new CustomClient(options).getCustomClient(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CustomClientCommand();
