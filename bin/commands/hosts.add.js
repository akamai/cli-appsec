let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class AddHostsCommand {
  constructor() {
    this.flags = 'add-hostname';
    this.desc = 'Add hostnames to selected list';
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
      .string('--version <num>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
        required: false
      })
      .stringArray('--hosts <a.com, b.net, c.d.com>', {
        desc: 'Hostnames to add to the selected list.',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).addHosts(),
      args: options,
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.hostnameList.length; i++) {
          hosts.push(data.hostnameList[i].hostName);
        }
        return hosts.join('\n');
      }
    });
  }
}

module.exports = new AddHostsCommand();
