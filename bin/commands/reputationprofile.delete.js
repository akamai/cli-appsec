let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class DeleteReputationProfileCommand {
  constructor() {
    this.flags = 'delete-reputation-profile';
    this.desc = 'Delete a reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage('Usage: akamai-appsec delete-reputation-profile --reputation-profile <id> [options]')
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
    out.print({
      promise: new ReputationProfile(options).deleteReputationProfile(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteReputationProfileCommand();
