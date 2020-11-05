let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class CreateMatchTargetCommand {
  constructor() {
    this.flags = 'create-match-target';
    this.desc = 'Creates a match target.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .usage(
        'Usage: akamai-appsec create-match-target --hostnames <a.com, b.net, c.d.com> --paths <x,y,z> [options]'
      )
      .stringArray('--hostnames <a.com, b.net, c.d.com>', {
        desc: 'Hostnames to add.',
        group: 'Required:',
        required: true
      })
      .stringArray('--paths <x,y,z>', {
        desc: 'The file paths',
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
    out.print({
      promise: new MatchTarget(options).createMatchTarget(),
      args: options,
      success: (args, data) => {
        return data.targetId;
      }
    });
  }
}

module.exports = new CreateMatchTargetCommand();
