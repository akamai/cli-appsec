let SecurityPolicyApiEndpoints = require('../../src/securitypolicyapiendpoints')
  .securitypolicyapiendpoints;
let out = require('./lib/out');

class SecurityPolicyApiEndpointsCommand {
  constructor() {
    this.flags = 'security-policy-api-endpoints';
    this.desc = '(Beta) List all api endpoints in a security policy.';
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
      });
  }
  run(options) {
    out.print({
      promise: new SecurityPolicyApiEndpoints(options).getApiEndpoints(),
      args: options,
      success: (args, data) => {
        data = data.apiEndpoints;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id + ' ' + data[i].name);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SecurityPolicyApiEndpointsCommand();
