let ContractsGroups = require('../../src/contractgroups').contractgroups;
let out = require('./lib/out');

const objectType = 'contract_groups';

class ContractGroupsCommand {
  constructor() {
    this.flags = 'contracts-groups';
    this.desc = '(Beta) List contracts and groups with KSD/WAP line items.';
    this.run = this.run.bind(this);
  }

  run(options) {
    out.print({
      promise: new ContractsGroups(options).getContractGroups(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(cg => {
          str.push(cg.contractId + ' ' + cg.groupId);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ContractGroupsCommand();
