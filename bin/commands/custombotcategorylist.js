let CustomBotCategory = require('../../src/custombotcategory').custombotcategory;
let out = require('./lib/out');

const objectType = 'categories';

class ListCustomBotCategoryCommand {
  constructor() {
    this.flags = 'custom-bot-category-list';
    this.desc = 'List all custom bot category.';
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
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new CustomBotCategory(options).getCustomBotCategoryList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.categoryId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomBotCategoryCommand();
