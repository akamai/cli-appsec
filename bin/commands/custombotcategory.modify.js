let CustomBotCategory = require('../../src/custombotcategory').custombotcategory;
let out = require('./lib/out');

class ModifyCustomBotCategoryCommand {
  constructor() {
    this.flags = 'modify-custom-bot-category';
    this.desc = 'Update existing custom bot category.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<category-id>', {
        paramsDesc: 'Custom Bot Category ID'
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
    options.category_id = options['category-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new CustomBotCategory(options).updateCustomBotCategory(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyCustomBotCategoryCommand();
