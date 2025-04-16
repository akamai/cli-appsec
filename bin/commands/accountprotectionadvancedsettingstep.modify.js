let AccountProtectionAdvancedSettings = require('../../src/accountprotectionadvancedsettings')
  .accountProtectionAdvancedSettings;
let out = require('./lib/out');

// Deprecated
class ModifyAccountProtectionTransactionEndpointProtectionCommand {
  constructor() {
    this.flags = 'modify-account-protection-transactional-endpoint-protection';
    this.desc =
      '[Deprecated] Modify account protected advanced settings for transactional endpoints.';
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
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }
  run(options) {
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new AccountProtectionAdvancedSettings(
        options
      ).updateTransactionalEndpointProtection(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyAccountProtectionTransactionEndpointProtectionCommand();
