let CustomBotCategory = require('../../src/custombotcategory').custombotcategory;
let out = require('./lib/out');

class DeleteCustomBotCategoryCommand {
  constructor() {
    this.flags = 'delete-custom-bot-category';
    this.desc = 'Delete a custom bot category.';
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
      });
  }

  run(options) {
    options.category_id = options['category-id'];

    out.print({
      promise: new CustomBotCategory(options).deleteCustomBotCategory(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteCustomBotCategoryCommand();
