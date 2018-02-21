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
      .stringArray('--hostnames <a.com, b.net, c.d.com>', {
        desc: 'Hostnames to add.',
        group: 'Options:',
        required: true
      })
      .stringArray('--paths <x,y,z>', {
        desc: 'The file paths',
        group: 'Options:',
        required: true
      })
      .string('--policy <id>', {
        desc: 'The policy id.',
        group: 'Options:',
        required: true
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
