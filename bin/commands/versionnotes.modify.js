let VersionNotes = require('../../src/versionnotes').versionNotes;
let out = require('./lib/out');

class ModifyVersionNotesCommand {
  constructor() {
    this.flags = 'modify-version-notes';
    this.desc = '(Beta) Modify the version notes.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('"<notes>"', {
        desc:
          'The version notes. If the input is a sentence, it must be wrapped in quotes. Ex. "This is the version notes."',
        group: 'Arguments:',
        mustExist: false
      })
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
      .check((argv, context) => {
        if (argv['notes']) {
          context.cliMessage('This operation is invalid.');
        }
      });
  }
  run(options) {
    out.print({
      promise: new VersionNotes(options).updateVersionNotes(),
      args: options,
      success: (args, data) => {
        return data.notes;
      }
    });
  }
}

module.exports = new ModifyVersionNotesCommand();
