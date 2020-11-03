let Config = require('../../src/configprovider').configProvider;
let out = require('./lib/out');

class CloneConfigCommand {
  constructor() {
    this.flags = 'clone-config';
    this.desc = '(Beta) Clone a new security config.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
        .positional('<@path>', {
          paramsDesc: 'The input file path.'
        })
        .check((argv, context) => {
          if (!argv['@path'].startsWith('@')) {
            return context.cliMessage("ERROR: Invalid file name, should start with '@'");
          }
        });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new Config(options).cloneConfig(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data.configId);
      }
    });
  }
}

module.exports = new CloneConfigCommand();
