let APIEndpoints = require('../../src/apiendpoints').apiEndpoints;
let out = require('./lib/out');

const objectType = 'apiEndpoints';

class ListAPIEndpointsCommand {
  constructor() {
    this.flags = 'api-endpoints';
    this.desc = 'List all api endpoints.';
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
        desc: 'Policy ID. If not provided, we try to use the policy available on file.',
        group: 'Optional:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new APIEndpoints(options).getAllAPIEndpoints(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(endpoint => {
          str.push(endpoint.id + ' ' + endpoint.name);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListAPIEndpointsCommand();
