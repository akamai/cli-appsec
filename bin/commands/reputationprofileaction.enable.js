let ReputationProfile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class EnableReputationProfileActionCommand {
  constructor() {
    this.flags = 'enable-reputation-profile';
    this.desc = '(Beta) Enable and set the action for a reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec enable-reputation-profile --reputation-profile <id> --action <action> [options]'
      )
      .number('--reputation-profile <id>', {
        desc: 'Reputation Profile ID.',
        group: 'Required:',
        required: true
      })
      .string('--action <action>', {
        desc:
          "Action to assign. Use - \n\t\t\t     • 'alert': To record the trigger of the event; \n\t\t\t     • 'deny': To block the request; \n\t\t\t     • 'deny_custom_{custom_deny_id}': To trigger a custom deny; \n\t\t\t     • 'none': To disassociate with the policy;",
        group: 'Required:',
        hints: '[required] [alert, deny, deny_custom_{custom_deny_id}, none]',
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
      promise: new ReputationProfile(options).enableReputationProfileAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableReputationProfileActionCommand();
