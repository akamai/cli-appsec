let ApiConstraint = require('../../src/apiconstraint').apiconstraint;
let out = require('./lib/out');

class DisableApiConstraintCommand {
  constructor() {
    this.flags = 'disable-api-request-constraints';
    this.desc = '(Beta) Disable API Request Constraint.';
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
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      })
      .string('--api <id>', {
        desc:
          'API ID. If not provided, the request constraints action is disabled for all the associated match target API IDs.',
        group: 'Optional:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new ApiConstraint(options).disableApiConstraint(),
      args: options,
      success: (args, data) => {
        if (!args['api']) {
          return '{"applyApiConstraints":' + data.applyApiConstraints + '}';
        } else {
          return JSON.stringify(data);
        }
      }
    });
  }
}

module.exports = new DisableApiConstraintCommand();
