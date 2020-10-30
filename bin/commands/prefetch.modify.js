let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class HttpHeaderLoggingCommand {
  constructor() {
    this.flags = 'modify-prefetch-requests';
    this.desc = '(Beta) Update the Prefetch Requests settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    const myArgs = process.argv.slice(2);
    if (myArgs[1].startsWith('@')) {
      options.file = myArgs[1].replace('@', '');
      out.print({
        promise: new AdvancedSettings(options).updatePrefetch(),
        args: options,
        success: (args, data) => {
          let allExtensions = data.allExtensions;
          let enableAppLayer = data.enableAppLayer;
          let enableRateControls = data.enableRateControls;
          let extensions = data.extensions;
          let str = [];
          if (allExtensions) {
            str.push('allExtensions');
          }
          if (enableAppLayer) {
            str.push('enableAppLayer');
          }
          if (enableRateControls) {
            str.push('enableRateControls');
          }
          if (extensions) {
            let extensionsStr = 'extensions';
            for (let i = 0; extensions && i < extensions.length; i++) {
              extensionsStr += ' ' + extensions[i];
            }
            str.push(extensionsStr);
          }
          return str.join(require('os').EOL);
        }
      });
    } else {
      throw 'Missing input file path.';
    }
  }
}

module.exports = new HttpHeaderLoggingCommand();
