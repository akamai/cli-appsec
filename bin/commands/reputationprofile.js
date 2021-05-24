let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class ReputationProfileCommand {
  constructor() {
    this.flags = 'reputation-profile';
    this.desc = 'Display contents of reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec reputation-profile --reputation-profile <id> [options]')
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
      });
  }

  run(options) {
    if (!options['reputation-profile'] && options._ && !isNaN(options._[0])) {
      options['reputation-profile'] = options._[0];
    }
    out.print({
      promise: new ReputationProfile(options).getReputationProfile(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ReputationProfileCommand();
