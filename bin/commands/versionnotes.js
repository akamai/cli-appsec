let VersionNotes = require('../../src/versionnotes').versionNotes;
let out = require('./lib/out');

class VersionNotesCommand {
  constructor() {
    this.flags = 'version-notes';
    this.desc = '(Beta) Display the version notes.';
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
      });
  }
  run(options) {
    out.print({
      promise: new VersionNotes(options).getVersionNotes(),
      args: options,
      success: (args, data) => {
        return data.notes ? data.notes : '';
      }
    });
  }
}

module.exports = new VersionNotesCommand();
