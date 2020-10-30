let Reputationprofile = require('../../src/reputationprofile').reputationProfile;
let out = require('./lib/out');

class ModifyReputationProfileCommand {
  constructor() {
    this.flags = 'modify-reputation-profile';
    this.desc = '(Beta) Update existing reputation profile.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
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
      .number('--reputation-profile <id>', {
        desc: 'Reputation Profile ID.',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    const myArgs = process.argv.slice(2);
    if (myArgs[1].startsWith('@')) {
      options.file = myArgs[1].replace('@', '');
      out.print({
        promise: new Reputationprofile(options).updateReputationProfile(),
        args: options,
        success: (args, data) => {
          return data.id;
        }
      });
    } else {
      throw 'Missing input file path.';
    }
  }
}

module.exports = new ModifyReputationProfileCommand();
