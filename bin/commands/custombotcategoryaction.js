let CustomBotCategoryAction = require('../../src/custombotcategoryaction').custombotcategoryaction;
let out = require('./lib/out');

class CustomBotCategoryActionCommand {
  constructor() {
    this.flags = 'custom-bot-category-action';
    this.desc = 'Display contents of custom bot category action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<category-id>', {
        paramsDesc: 'Custom Bot Category ID'
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
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    options.category_id = options['category-id'];

    out.print({
      promise: new CustomBotCategoryAction(options).getCustomBotCategoryAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CustomBotCategoryActionCommand();
