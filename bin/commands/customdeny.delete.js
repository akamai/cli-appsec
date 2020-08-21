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
      });
  }

  run(options) {
    //get args
    const args = process.argv.slice(3, 5);

    if (!args[0]) {
      throw 'Missing custom deny Id.';
    }

    options.custom_deny_id = args[0];

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
