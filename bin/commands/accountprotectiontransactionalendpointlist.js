let AccountProtectionTransactionalEndpoint = require('../../src/accountprotectiontransactionalendpoint')
  .accountProtectionTransactionalEndpoint;
let out = require('./lib/out');

const objectType = 'operations';

class ListAccountProtectionTransactionEndpointsCommand {
  constructor() {
    this.flags = 'account-protection-transactional-endpoint-list';
    this.desc = 'List all account protected transactional endpoints.';
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
      promise: new AccountProtectionTransactionalEndpoint(options).getTransactionalEndpointList(),
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

module.exports = new ListAccountProtectionTransactionEndpointsCommand();
