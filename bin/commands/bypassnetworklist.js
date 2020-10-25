let BypassNL = require('../../src/bypassnl').bypassnetworklist;
let out = require('./lib/out');

class BypassNLCommand {
  constructor() {
    this.flags = 'bypass-network-lists';
    this.desc = '(Beta) List all bypass network lists.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new BypassNL(options).getBypassNetworkList(),
      args: options,
      success: (args, data) => {
        data = data.networkLists;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new BypassNLCommand();
