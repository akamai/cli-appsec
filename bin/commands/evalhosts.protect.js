let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class ProtectEvalHostsCommand {
  constructor() {
    this.flags = 'protect-eval-hostnames';
    this.desc = '(Beta) Move evaluation hostnames to protection.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <num>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    const args = process.argv.slice(3, 4);

    if (!args[0].startsWith('@')) {
      throw 'Missing file name.';
    }

    options.file = args[0].replace('@', '');

    out.print({
      promise: new SelectedHosts(options).protectEvalHosts(),
      args: options,
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.hostnames.length; i++) {
          hosts.push(data.hostnames[i]);
        }
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ProtectEvalHostsCommand();
