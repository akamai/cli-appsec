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
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      })
      .number('--reputation-profile <id>', {
        desc: 'Reputation Profile ID.',
        group: 'Options:',
        required: true
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
