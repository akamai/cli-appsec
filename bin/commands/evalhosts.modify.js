let out = require('./lib/out');
let SelectedHosts = require('../../src/hosts').selectedHosts;

const objectType = 'hostnames';

class ModifyEvalHostsCommand {
  constructor() {
    this.flags = 'modify-eval-hostnames';
    this.desc = 'Modify hostnames under evaluation.';
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
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Options:',
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
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new SelectedHosts(options).updateEvalHosts(),
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

module.exports = new ModifyEvalHostsCommand();
