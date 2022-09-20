let AkamaiBotCategoryAction = require('../../src/akamaibotcategoryaction').akamaibotcategoryaction;
let out = require('./lib/out');

class AkamaiBotCategoryActionCommand {
  constructor() {
    this.flags = 'akamai-bot-category-action';
    this.desc = 'Display contents of akamai bot category action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<category-id>', {
        paramsDesc: 'Akamai Bot Category ID'
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
      promise: new AkamaiBotCategoryAction(options).getAkamaiBotCategoryAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new AkamaiBotCategoryActionCommand();
