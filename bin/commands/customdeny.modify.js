let CustomDeny = require('../../src/customdeny').customdeny;
let out = require('./lib/out');

class ModifyCustomDenyCommand {
  constructor() {
    this.flags = 'modify-custom-deny';
    this.desc = 'Update existing custom deny action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<custom-deny-id>', {
        paramsDesc: 'Custom Deny ID'
      })
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
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
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.custom_deny_id = options['custom-deny-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new CustomDeny(options).updateCustomdeny(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyCustomDenyCommand();
