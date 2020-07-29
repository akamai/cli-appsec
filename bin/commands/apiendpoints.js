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
        desc: 'Configuration id. Mandatory if you have more than one configuration.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
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
          str.push(data[i].id);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListAPIEndpointsCommand();
