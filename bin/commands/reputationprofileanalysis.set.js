let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class SetReputationProfileAnalysisCommand {
  constructor() {
    this.flags = 'set-reputation-profile-analysisn';
    this.desc = '(Beta) Set the reputation profile analysis settings';
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
      .boolean('--forwardToHTTPHeader <boolean>', {
        desc:
          'Option to add client reputation details to requests forwarded to origin in an HTTP header',
        group: 'Options:',
        required: false
      })
      .boolean('--forwardSharedIPToHTTPHeaderAndSIEM <boolean>', {
        desc:
          'Option to add value indicating that shared IPs are included in HTTP header and SIEM integration when used.',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new ReputationProfile(options).updateReputationAnalysisSettings(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new SetReputationProfileAnalysisCommand();
