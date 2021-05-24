let Reputationprofile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class ModifyReputationProfileCommand {
  constructor() {
    this.flags = 'modify-reputation-profile';
    this.desc = 'Update existing reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec modify-reputation-profile <@path> --reputation-profile <id> [options]'
      )
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
      .number('--reputation-profile <id>', {
        desc: 'Reputation Profile ID.',
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
      promise: new Reputationprofile(options).updateReputationProfile(),
      args: options,
      success: (args, data) => {
        return data.id;
      }
    });
  }
}

module.exports = new ModifyReputationProfileCommand();
