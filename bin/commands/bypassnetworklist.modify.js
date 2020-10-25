let BypassNL = require('../../src/bypassnl').bypassnetworklist;
let out = require('./lib/out');

class ModifyBypassNLCommand {
  constructor() {
    this.flags = 'modify-bypass-network-lists';
    this.desc = '(Beta) Update bypass network lists.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
      })
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
    //get args
    const args = process.argv.slice(3, 4);

    if (!args[0] || !args[0].startsWith('@')) {
      throw 'Missing file name.';
    }
    options.file = args[0].replace('@', '');

    out.print({
      promise: new BypassNL(options).updateBypassNetworkList(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyBypassNLCommand();
