let CustomDeny = require('../../src/customdeny').customdeny;
let out = require('./lib/out');

class DeleteCustomDenyCommand {
  constructor() {
    this.flags = 'delete-custom-deny';
    this.desc = 'Delete a custom deny action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<custom-deny-id>', {
        paramsDesc: 'Custom Deny ID'
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
    options.custom_deny_id = options['custom-deny-id'];

    out.print({
      promise: new CustomDeny(options).deleteCustomdeny(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteCustomDenyCommand();
