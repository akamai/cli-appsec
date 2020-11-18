let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class ReputationProfileActionCommand {
  constructor() {
    this.flags = 'reputation-profile-action';
    this.desc = '(Beta) Display the current reputation profile action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec reputation-profile-action --reputation-profile <id> [options]')
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
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    if (!options['reputation-profile'] && options._ && !isNaN(options._[0])) {
      options['reputation-profile'] = options._[0];
    }
    out.print({
      promise: new ReputationProfile(options).getReputationProfileAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ReputationProfileActionCommand();
