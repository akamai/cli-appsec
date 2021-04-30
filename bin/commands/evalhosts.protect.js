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
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new SelectedHosts(options).protectEvalHosts(),
      args: options,
      objectType: 'hostnames',
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.length; i++) {
          hosts.push(data[i]);
        }
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ProtectEvalHostsCommand();
