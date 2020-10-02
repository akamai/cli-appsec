let CustomDeny = require('../../src/customdeny').customdeny;
let out = require('./lib/out');

class CreateCustomDenyCommand {
  constructor() {
    this.flags = 'create-custom-deny';
    this.desc = 'Create a custom deny action.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.',
        group: 'Arguments:',
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
      .check((argv, context) => {
        if (!argv || !argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    //get args
    const args = process.argv.slice(3, 5);
    options.file = args[0].replace('@', '');

    out.print({
      promise: new CustomDeny(options).addCustomdeny(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new CreateCustomDenyCommand();
