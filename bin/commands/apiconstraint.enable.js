let ApiConstraint = require('../../src/apiconstraint').apiconstraint;
let out = require('./lib/out');

class EnableApiConstraintCommand {
  constructor() {
    this.flags = 'enable-api-request-constraints';
    this.desc = '(Beta) Set the API Request Constraint action.';
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
      .string('--api <id>', {
        desc:
          'The api id to use. If not provided, the request constraints action is set for all the associated match target api ids.',
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
    out.print({
      promise: new ApiConstraint(options).enableApiConstraintAction(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new EnableApiConstraintCommand();
