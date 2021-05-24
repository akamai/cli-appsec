let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class HttpHeaderLoggingCommand {
  constructor() {
    this.flags = 'prefetch-requests';
    this.desc = 'Display the Prefetch Requests settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new AdvancedSettings(options).getPrefetch(),
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
  }
}

module.exports = new HttpHeaderLoggingCommand();
