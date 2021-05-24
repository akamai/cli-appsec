let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

const objectType = 'reputationProfiles';

class ListReputationProfilesCommand {
  constructor() {
    this.flags = 'reputation-profiles';
    this.desc = 'List all reputation profiles.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
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
      promise: new ReputationProfile(options).getAllReputationProfiles(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(profile => {
          str.push(profile.id);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListReputationProfilesCommand();
