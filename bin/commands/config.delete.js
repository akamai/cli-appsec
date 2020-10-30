let Config = require('../../src/configprovider').configProvider;
let out = require('./lib/out');

class CreateConfigCommand {
  constructor() {
    this.flags = 'delete-config';
    this.desc = '(Beta) Delete a security config.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration ID. Mandatory if you have more than one configuration.',
      group: 'Options:',
      required: false
    });
  }

  run(options) {
    //get args
    out.print({
      promise: new Config(options).deleteConfig(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new CreateConfigCommand();
