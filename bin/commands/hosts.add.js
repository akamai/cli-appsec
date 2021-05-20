let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

class AddHostsCommand {
  constructor() {
    this.flags = 'add-hostname';
    this.desc = 'Add hostnames to selected list.';
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
      })
      .positional('<hostnames>', {
        params: [
          {
            desc: 'The comma separated list of hostnames to add.',
            type: 'array:string'
          }
        ]
      })
      .epilogue(
        'NOTE: THIS WILL BE DEPRECATED IN THE NEXT RELEASE. INSTEAD USE: `akamai appsec modify-hostnames @path --append [options]`\n\nCopyright (C) Akamai Technologies, Inc\nVisit http://github.com/akamai/cli-appsec for detailed documentation.'
      );
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).addHosts(),
      args: options,
      objectType: 'hostnameList',
      success: (args, data) => {
        let hosts = [];
        for (let i = 0; i < data.length; i++) {
          hosts.push(data[i].hostname);
        }
        return hosts.join(require('os').EOL);
      }
    });
  }
}

module.exports = new AddHostsCommand();
