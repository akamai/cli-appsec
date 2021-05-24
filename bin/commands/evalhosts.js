let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

const objectType = 'hostnames';

class EvalHostsCommand {
  constructor() {
    this.flags = 'eval-hostnames';
    this.desc = 'List all hosts under evaluation.';
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
      promise: new SelectedHosts(options).evalHosts(),
      args: options,
      objectType,
      success: (args, data) => {
        let hosts = [];
        data[objectType].forEach(host => {
          hosts.push(host);
        });
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new EvalHostsCommand();
