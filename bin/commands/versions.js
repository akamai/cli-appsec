let out = require('./lib/out');
let Version = require('../../src/versionsProvider').versionProvider;

class VersionsCommand {
  constructor() {
    this.flags = 'versions';
    this.desc = 'List all config versions';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration id. Mandatory if you have more than one configuration.',
      group: 'Options:',
      required: false
    });
  }

  run(options) {
    out.print({
      promise: new Version(options).versions(),
      args: options,
      success: (args, data) => {
        let vids = [];
        for (let i = 0; i < data.versionList.length; i++) {
          vids.push(data.versionList[i].version);
        }
        return vids.join('\n');
      }
    });
  }
}

module.exports = new VersionsCommand();
