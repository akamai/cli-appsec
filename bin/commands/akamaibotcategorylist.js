let AkamaiBotCategory = require('../../src/akamaibotcategory').akamaibotcategory;
let out = require('./lib/out');

const objectType = 'categories';

class ListAkamaiBotCategoryCommand {
  constructor() {
    this.flags = 'akamai-bot-category-list';
    this.desc = 'List all akamai bot category.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {}

  run(options) {
    out.print({
      promise: new AkamaiBotCategory(options).getAkamaiBotCategoryList(),
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

module.exports = new ListAkamaiBotCategoryCommand();
