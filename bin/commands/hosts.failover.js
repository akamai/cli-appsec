let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class SelectableHostsCommand {
  constructor() {
    this.flags = 'failover-hostnames';
    this.desc = 'List all failover hostnames.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac.number('--config <id>', {
      desc: 'Configuration ID. Mandatory if you have more than one configuration.',
      group: 'Options:',
      required: false
    });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).failoverHosts(),
      args: options,
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.hostnameList.length; i++) {
          hosts.push(data.hostnameList[i].hostname);
        }
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SelectableHostsCommand();
