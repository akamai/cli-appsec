let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class SelectableHostsCommand {
  constructor() {
    this.flags = 'selectable-hostnames';
    this.desc = 'List all selectable hostnames.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).selectableHosts(),
      args: options,
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.availableSet.length; i++) {
          hosts.push(data.availableSet[i].hostName);
        }
        return hosts.join('\n');
      }
    });
  }
}

module.exports = new SelectableHostsCommand();
