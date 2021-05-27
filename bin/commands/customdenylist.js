let CustomDeny = require('../../src/customdeny').customdeny;
let out = require('./lib/out');

const objectType = 'customDenyList';

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
      .string('--search <id>', {
        desc: 'Search string to perform partial search on name, description or ID.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new CustomDeny(options).getCustomdenyList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListCustomDenyCommand();
