let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class EvalHostsCommand {
  constructor() {
    this.flags = 'eval-hostnames';
    this.desc = '(Beta) List all hosts under evaluation.';
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
      .string('--version <num>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).evalHosts(),
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

module.exports = new EvalHostsCommand();
