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
        data = data.configurations;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ConfigsCommand();
