let VersionNotes = require('../../src/versionnotes').versionNotes;
let out = require('./lib/out');

class ModifyVersionNotesCommand {
  constructor() {
    this.flags = 'modify-version-notes';
    this.desc = 'Update the version notes.';
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
      .string('--notes <notes>', {
        desc: 'The version notes, if left empty, it will erase the current version notes.',
        group: 'Options:',
        required: false
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
