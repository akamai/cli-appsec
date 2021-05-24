let BypassNL = require('../../src/bypassnl').bypassnetworklist;
let out = require('./lib/out');

const objectType = 'networkLists';

class BypassNLCommand {
  constructor() {
    this.flags = 'bypass-network-lists';
    this.desc = 'List all bypass network lists.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:'
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:'
      });
  }

  run(options) {
    out.print({
      promise: new BypassNL(options).getBypassNetworkList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(nl => {
          str.push(nl.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new BypassNLCommand();
