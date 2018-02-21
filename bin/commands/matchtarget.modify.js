let out = require('./lib/out');
let MatchTarget = require('../../src/matchtarget').matchTarget;

class ModifyMatchTargetCommand {
  constructor() {
    this.flags = 'modify-match-target';
    this.desc = 'Updates a match target.';
    this.setup = this.setup.bind(this);
  }

  setup(sywac) {
    sywac.command('add-hostname', {
      desc: 'Add hostname to the given match target.',
      setup: sywac => {
        sywac
          .number('--config <id>', {
            desc: 'Configuration id number',
            group: 'Options:',
            required: false
          })
          .string('--version <num>', {
            desc:
              "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
            group: 'Options:',
            required: false
          })
          .number('--match-target <id>', {
            desc: 'Match target id to update.',
            group: 'Options:',
            required: true
          })
          .stringArray('--hostnames <a.com, b.c.com>', {
            desc: 'The list of hostnames to add to this match target.',
            group: 'Options:',
            required: true
          });
      },
      run: options => {
        out.print({
          promise: new MatchTarget(options).addHostnames(),
          args: options,
          success: (args, data) => {
            return data.targetId;
          }
        });
      }
    });
  }
}

module.exports = new ModifyMatchTargetCommand();
