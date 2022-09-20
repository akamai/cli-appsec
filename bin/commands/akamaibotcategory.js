let AkamaiBotCategory = require('../../src/akamaibotcategory').akamaibotcategory;
let out = require('./lib/out');

class AkamaiBotCategoryCommand {
  constructor() {
    this.flags = 'akamai-bot-category';
    this.desc = 'Display contents of akamai bot category.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.positional('<category-id>', {
      paramsDesc: 'Akamai Bot Category ID'
    });
  }

  run(options) {
    options.category_id = options['category-id'];

    out.print({
      promise: new AkamaiBotCategory(options).getAkamaiBotCategory(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new AkamaiBotCategoryCommand();
