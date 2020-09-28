let Config = require('../../src/configprovider').configProvider;
let out = require('./lib/out');

class CreateConfigCommand {
  constructor() {
    this.flags = 'create-config';
    this.desc = 'Create a new security config.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.string('@<path>', {
      desc: 'The input file path.',
      group: 'Options:',
      mustExist: true
    });
  }

  run(options) {
    //get args
    const args = process.argv.slice(3, 5);

    if (!args[0] || !args[0].startsWith('@')) {
      throw 'Missing file name.';
    }
    options.file = args[0].replace('@', '');

    out.print({
      promise: new Config(options).createConfig(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data.configId);
      }
    });
  }
}

module.exports = new CreateConfigCommand();
