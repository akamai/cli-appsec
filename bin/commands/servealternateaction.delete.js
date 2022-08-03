let ServeAlternateAction = require('../../src/servealternateaction').servealternateaction;
let out = require('./lib/out');

class DeleteServeAlternateActionCommand {
  constructor() {
    this.flags = 'delete-serve-alternate-action';
    this.desc = 'Delete a serve alternate action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<action-id>', {
        paramsDesc: 'Serve Alternate Action ID'
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
      promise: new ServeAlternateAction(options).deleteServeAlternateAction(),
      args: options,
      success: (args, data) => {
        return data.statusCode;
      }
    });
  }
}

module.exports = new DeleteServeAlternateActionCommand();
