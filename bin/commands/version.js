let out = require('./lib/out');
let Version = require('../../src/versionsProvider').versionProvider;

class VersionCommand {
  constructor() {
    this.flags = 'version';
    this.desc = 'Read a config version';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id number',
        group: 'Options:',
        required: false
      })
      .string('--version <num>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Version(options).version(),
      args: options,
      success: (args, data) => {
        //we want the whole json irrespective of the json flag
        return data;
      }
    });
  }
}

module.exports = new VersionCommand();
