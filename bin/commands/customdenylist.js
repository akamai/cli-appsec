let CustomDeny = require('../../src/customdeny').customdeny;
let out = require('./lib/out');

class ListCustomDenyCommand {
  constructor() {
    this.flags = 'custom-deny-list';
    this.desc = 'List all custom deny actions.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .string('--search <id>', {
        desc: 'Search String.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new CustomDeny(options).getCustomdenyList(),
      args: options,
      success: (args, data) => {
        data = data.customDenyList;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomDenyCommand();
