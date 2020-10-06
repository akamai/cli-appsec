let APIEndpoints = require('../../src/apiendpoints').apiEndpoints;
let out = require('./lib/out');

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
        desc: 'Policy ID. If not provided, we try to use the policy available on file.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    out.print({
      promise: new APIEndpoints(options).getAllAPIEndpoints(),
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

module.exports = new ListAPIEndpointsCommand();
