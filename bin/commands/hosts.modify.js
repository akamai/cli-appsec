let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;
let Mode = require('../../src/hosts').mode;

const objectType = 'hostnameList';

class AddHostsCommand {
  constructor() {
    this.flags = 'modify-hostnames';
    this.desc = 'Modify hostnames for the configuration version.';
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
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
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
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');
    out.print({
      promise: new SelectedHosts(options).modifyHosts(),
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

module.exports = new AddHostsCommand();
