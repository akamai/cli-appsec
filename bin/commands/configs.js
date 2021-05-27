let out = require('./lib/out');
let Config = require('../../src/configprovider').configProvider;

const objectType = 'configurations';

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
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(config => {
          str.push(config.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ConfigsCommand();
