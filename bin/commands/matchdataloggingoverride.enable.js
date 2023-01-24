let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class MatchDataLoggingOverrideEnableCommand {
  constructor() {
    this.flags = 'enable-override-match-data-logging';
    this.desc = 'Enable the Match Data Logging Override settings.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
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
      })
      .string('--policy <id>', {
        desc: 'Policy ID. If not provided, we try to use the policy available on file.',
        group: 'Optional:',
        required: false
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }
  run(options) {
    options.file = options['@path'].replace('@', '');
    out.print({
      promise: new AdvancedSettings(options).enableOverrideMatchDataLogging(),
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
  }
}

module.exports = new MatchDataLoggingOverrideEnableCommand();
