let out = require('./lib/out');
let Config = require('../../src/configprovider').configProvider;

class ConfigsCommand {
  constructor() {
    this.flags = 'configs';
    this.desc = 'List all available configurations.';
    this.run = this.run.bind(this);
  }

  run(options) {
    out.print({
      promise: new Config(options).configs(),
      args: options,
      success: (args, data) => {
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].configId);
        }
        return str.join('\n');
      }
    });
  }
}

module.exports = new ConfigsCommand();
