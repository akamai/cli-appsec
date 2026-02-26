let urlProtectionRulesActions = require('../../src/urlprotection').urlProtection;
let out = require('./lib/out');

const objectType = 'urlProtectionRulesActions';

class UrlProtectionRulesActionsCommand {
  constructor() {
    this.flags = 'url-protection-rules-actions';
    this.desc = 'Display all url protection rules actions.';
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
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new urlProtectionRulesActions(options).getAllURLProtectionRulesActions(),
      args: options,
      objectType,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new UrlProtectionRulesActionsCommand();
