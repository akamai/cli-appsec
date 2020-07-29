let Rules = require('../../src/rules').rules;
let out = require('./lib/out');

class EnableRuleCommand {
  constructor() {
    this.flags = 'enable-rule-action';
    this.desc = '(Beta) Enable attack group.';
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
      })
      .string('--policy <id>', {
        desc:
          'The policy id to use. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Options:',
        required: false
      })
      .string('--action <id>', {
        desc: 'Action to assign. ',
        group: 'Options:',
        required: true
      });
  }

  run(options) {
    //get 3rd argument
    const myArgs = process.argv.slice(3);

    if (myArgs[0]) {
      if (isNaN(myArgs[0])) {
        throw 'Invalid rule Id.';
      }

      options.ruleId = myArgs[0];
      out.print({
        promise: new Rules(options).enableRuleAction(),
        args: options,
        success: (args, data) => {
          return JSON.stringify(data);
        }
      });
    } else {
      throw 'Missing rule Id.';
    }
  }
}

module.exports = new EnableRuleCommand();
