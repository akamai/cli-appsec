let CustomBotCategoryItemSequence = require('../../src/custombotcategoryitemsequence')
  .custombotcategoryitemsequence;
let out = require('./lib/out');
class CustomBotCategoryItemSequenceCommand {
  constructor() {
    this.flags = 'custom-bot-category-item-sequence';
    this.desc = 'Display contents of custom bot category item sequence.';
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
    out.print({
      promise: new CustomBotCategoryItemSequence(options).getCustomBotCategoryItemSequence(),
      args: options,
      success: (args, data) => {
        delete data.validation;
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CustomBotCategoryItemSequenceCommand();
