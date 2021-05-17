let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;
let Mode = require('../../src/hosts').mode;

class AddHostsCommand {
  constructor() {
    this.flags = 'modify-hostnames';
    this.desc = '(Beta) Modify hostnames for the configuration version.';
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
      .boolean('--append', {
        desc: 'Appends the hostnames provided to the existing selected hostnames.',
        group: 'Optional:',
        required: false
      })
      .boolean('--remove', {
        desc: 'Removes the hostnames provided from the existing selected hostnames.',
        group: 'Optional:',
        required: false
      })
      .boolean('--replace', {
        desc: 'Replaces the existing selected hostnames with the hostnames provided.',
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
      .check((argv, context) => {
        if (
          (argv[Mode.APPEND] && (argv[Mode.REMOVE] || argv[Mode.REPLACE])) ||
          (argv[Mode.REMOVE] && (argv[Mode.APPEND] || argv[Mode.REPLACE])) ||
          (argv[Mode.REPLACE] && (argv[Mode.REMOVE] || argv[Mode.APPEND]))
        ) {
          return context.cliMessage(
            "ERROR: Please pass in just one of the following arguments 'append', 'remove', or 'replace'"
          );
        }
      });
  }

  run(options) {
    out.print({
      promise: new SelectedHosts(options).modifyHosts(),
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
