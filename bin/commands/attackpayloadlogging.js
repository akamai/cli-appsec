let AdvancedSettings = require('../../src/advancedsettings').advancedsettings;
let out = require('./lib/out');

class AttackPayloadLoggingCommand {
  constructor() {
    this.flags = 'attack-payload-logging';
    this.desc = 'Display the Attack Payload Logging settings.';
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
          'Policy ID. If provided, returns policy-level settings. If not provided, returns config-level settings.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new AdvancedSettings(options).getAttackPayloadLogging(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new AttackPayloadLoggingCommand();
