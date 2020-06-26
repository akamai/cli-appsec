let SlowPost = require('../../src/slowpost').slowPost;
let out = require('./lib/out');

class EnableSlowPostCommand {
  constructor() {
    this.flags = 'enable-slow-post';
    this.desc = '(Beta) Enable slow post on the policy.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .string('@<path>', {
        desc: 'The input file path.',
        group: 'Options:',
        mustExist: true
      })
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
      });
  }

  run(options) {
    const myArgs = process.argv.slice(2);
    if (myArgs[1].startsWith('@')) {
      options.file = myArgs[1].replace('@', '');
      out.print({
        promise: new SlowPost(options).enableSlowPost(),
        args: options,
        success: (args, data) => {
          return JSON.stringify(data);
        }
      });
    } else {
      throw 'Missing input file path.';
    }
  }
}
module.exports = new EnableSlowPostCommand();
