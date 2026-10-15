let AiRules = require('../../src/airules').airules;
let out = require('./lib/out');

class ModifyAiRuleActionCommand {
  constructor() {
    this.flags = 'modify-ai-rule-action';
    this.desc = 'Modify the action for a specific AI rule in a security policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .number('--rule-id <id>', {
        desc: 'AI Rule ID.',
        group: 'Required:',
        required: true
      })
      .number('--rule-version-id <id>', {
        desc: 'AI Rule Version ID.',
        group: 'Required:',
        required: true
      })
      .positional('<@path>', {
        paramsDesc: 'The input file path.'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: true
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: true
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: true
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
      promise: new AiRules(options).updateAiRuleAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new ModifyAiRuleActionCommand();
