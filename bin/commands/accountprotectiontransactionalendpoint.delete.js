let AccountProtectionTransactionalEndpoint = require('../../src/accountprotectiontransactionalendpoint')
  .accountProtectionTransactionalEndpoint;
let out = require('./lib/out');

const objectType = 'operations';

class DeleteAccountProtectionTransactionEndpointCommand {
  constructor() {
    this.flags = 'delete-account-protection-transactional-endpoint';
    this.desc = 'Delete account protection transactional endpoint by operation id.';
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
      promise: new AccountProtectionTransactionalEndpoint(options).deleteTransactionalEndpoint(),
      args: options,
      success: (args, data) => {
        return data;
      }
    });
  }
}

module.exports = new DeleteAccountProtectionTransactionEndpointCommand();
