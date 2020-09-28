let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class HttpHeaderLoggingCommand {
  constructor() {
    this.flags = 'enable-override-http-header-logging';
    this.desc = '(Beta) Enable the HTTP Header Logging Override settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
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
      })
      .string('--policy <id>', {
        desc: 'The policy id to use. If not provided, we try to use the policy available on file.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    const myArgs = process.argv.slice(2);
    if (myArgs[1].startsWith('@')) {
      options.file = myArgs[1].replace('@', '');
      out.print({
        promise: new AdvancedSettings(options).enableOverrideLogging(),
        args: options,
        success: (args, data) => {
          let override = data.override;
          let allowSampling = data.allowSampling;
          let cookies = data.cookies;
          let customHeaders = data.customHeaders;
          let standardHeaders = data.standardHeaders;
          let str = [];

          if (override) {
            str.push('override');
          }
          if (allowSampling) {
            str.push('allowSampling');
          }
          let cookiesStr = 'cookies ' + cookies.type;
          if (cookies.values) {
            for (let i = 0; cookies.values && i < cookies.values.length; i++) {
              cookiesStr += ' ' + cookies.values[i];
            }
          }
          str.push(cookiesStr);
          let customHeadersStr = 'customHeaders ' + customHeaders.type;
          if (customHeaders.values) {
            for (let i = 0; customHeaders.values && i < customHeaders.values.length; i++) {
              customHeadersStr += ' ' + customHeaders.values[i];
            }
          }
          str.push(customHeadersStr);
          let standardHeadersStr = 'standardHeaders ' + standardHeaders.type;
          if (standardHeaders.values) {
            for (let i = 0; standardHeaders.values && i < standardHeaders.values.length; i++) {
              standardHeadersStr += ' ' + standardHeaders.values[i];
            }
          }
          str.push(standardHeadersStr);
          return str.join(require('os').EOL);
        }
      });
    } else {
      throw 'Missing input file path.';
    }
  }
}

module.exports = new HttpHeaderLoggingCommand();
