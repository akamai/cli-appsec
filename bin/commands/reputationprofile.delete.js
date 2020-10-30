let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class DeleteReputationProfileCommand {
  constructor() {
    this.flags = 'delete-reputation-profile';
    this.desc = '(Beta) Delete a reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
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
