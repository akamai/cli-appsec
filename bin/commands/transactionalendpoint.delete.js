let TransactionalEndpoint = require('../../src/transactionalendpoint').transactionalendpoint;
let out = require('./lib/out');

class DeleteTransactionalEndpointCommand {
  constructor() {
    this.flags = 'delete-transactional-endpoint';
    this.desc = 'Delete a transactional endpoint.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<operation-id>', {
        paramsDesc: 'Operation ID'
      })
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
    options.operation_id = options['operation-id'];

    out.print({
      promise: new TransactionalEndpoint(options).deleteTransactionalEndpoint(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteTransactionalEndpointCommand();
