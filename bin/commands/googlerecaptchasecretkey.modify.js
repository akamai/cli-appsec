let GoogleRecaptchaSecretKey = require('../../src/googlerecaptchasecretkey')
  .googlerecaptchasecretkey;
let out = require('./lib/out');

class ModifyGoogleRecaptchaSecretKeyCommand {
  constructor() {
    this.flags = 'modify-google-recaptcha-secret-key';
    this.desc = 'Update existing google recaptcha secret key.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<action-id>', {
        paramsDesc: 'Challenge Action ID'
      })
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
    options.action_id = options['action-id'];
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new GoogleRecaptchaSecretKey(options).updateGoogleRecaptchaSecretKey(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new ModifyGoogleRecaptchaSecretKeyCommand();
