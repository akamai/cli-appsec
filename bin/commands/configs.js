let out = require('./lib/out');
let Config = require('../../src/configprovider').configProvider;

const objectType = 'configurations';

class ConfigsCommand {
  constructor() {
    this.flags = 'configs';
    this.desc = 'List all available configurations.';
    this.run = this.run.bind(this);
    this.setup = this.setup.bind(this);
  }

  setup(sywac) {
    sywac
      .boolean('--include-hostnames', {
        desc: 'Specify whether to include staging and production hostnames. Defaults to true.',
        group: 'Optional:',
        required: false
      })
      .boolean('--include-contract-group', {
        desc: 'Specify whether to include contract and group id. Defaults to false.',
        group: 'Optional:',
        required: false
      });
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
