let out = require('./lib/out');
let Version = require('../../src/versionsprovider').versionProvider;

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
        desc:
          "Configuration id number. If not provided, assumes there is only one configuration and chooses it. If there's more, an error is thrown.",
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
    //if version is provided without the parameter name, try to recognize it
    if (!options.version && options._ && !isNaN(options._[0])) {
      options.version = options._[0];
    }
    out.print({
      promise: new Version(options).version(),
      args: options,
      success: (args, data) => {
        //we want the whole json irrespective of the json flag
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new VersionCommand();
