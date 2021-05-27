let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

const objectType = 'hostnameList';

class SelectableHostsCommand {
  constructor() {
    this.flags = 'selected-hostnames';
    this.desc = 'List all currently chosen hostnames.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).selectedHosts(),
      args: options,
      objectType,
      success: (args, data) => {
        let hosts = [];
        data[objectType].forEach(host => {
          hosts.push(host.hostname);
        });
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SelectableHostsCommand();
