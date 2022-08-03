let ConditionalAction = require('../../src/conditionalaction').conditionalaction;
let out = require('./lib/out');

class DeleteConditionalActionCommand {
  constructor() {
    this.flags = 'delete-conditional-action';
    this.desc = 'Delete a conditional action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<action-id>', {
        paramsDesc: 'Conditional Action ID'
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
      promise: new ConditionalAction(options).deleteConditionalAction(),
      args: options,
      success: (args, data) => {
        return data.statusCode;
      }
    });
  }
}

module.exports = new DeleteConditionalActionCommand();
