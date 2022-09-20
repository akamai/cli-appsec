let CustomDenyAction = require('../../src/customdenyaction').customdenyaction;
let out = require('./lib/out');

class CustomDenyActionCommand {
  constructor() {
    this.flags = 'custom-deny-action';
    this.desc = 'Display contents of custom deny action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<action-id>', {
        paramsDesc: 'Custom Deny Action ID'
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
    options.action_id = options['action-id'];

    out.print({
      promise: new CustomDenyAction(options).getCustomDenyAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CustomDenyActionCommand();
