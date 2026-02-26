let URLProtection = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

class ModifyURLProtectionRuleCommand {
  constructor() {
    this.flags = 'modify-url-protection-rule';
    this.desc = 'Update existing URL protection rule.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec modify-url-protection-rule <@path> --url-protection-policy <id> [options]'
      )
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
      .number('--url-protection-policy <id>', {
        desc: 'URL Protection Policy ID.',
        group: 'Required:',
        required: true
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
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');
    out.print({
      promise: new URLProtection(options).updateURLProtectionRule(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}

module.exports = new ModifyURLProtectionRuleCommand();
