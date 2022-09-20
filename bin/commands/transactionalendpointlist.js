let TransactionalEndpoint = require('../../src/transactionalendpoint').transactionalendpoint;
let out = require('./lib/out');

const objectType = 'operations';

class ListTransactionalEndpointCommand {
  constructor() {
    this.flags = 'transactional-endpoint-list';
    this.desc = 'List all transactional endpoint.';
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
      });
  }
  run(options) {
    out.print({
      promise: new TransactionalEndpoint(options).getTransactionalEndpointList(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(action => {
          str.push(action.operationId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ListTransactionalEndpointCommand();
