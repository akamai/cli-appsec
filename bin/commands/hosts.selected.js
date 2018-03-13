let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

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
      promise: new SelectedHosts(options).selectedHosts(),
      args: options,
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.hostnameList.length; i++) {
          hosts.push(data.hostnameList[i].hostName);
        }
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SelectableHostsCommand();
