let CustomBotCategorySequence = require('../../src/custombotcategorysequence')
  .custombotcategorysequence;
let out = require('./lib/out');

class CustomBotCategorySequenceCommand {
  constructor() {
    this.flags = 'custom-bot-category-sequence';
    this.desc = 'Display contents of custom bot category sequence.';
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
      promise: new CustomBotCategorySequence(options).getCustomBotCategorySequence(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CustomBotCategorySequenceCommand();
