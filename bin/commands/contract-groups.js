let Contractgroups = require('../../src/contractgroups').contractgroups;
let out = require('./lib/out');

class ContractGroupsCommand {
  constructor() {
    this.flags = 'contract-groups';
    this.desc = 'List contract groups with KSD/WAP line items.';
    this.run = this.run.bind(this);
  }

  run(options) {
    out.print({
      promise: new Contractgroups(options).getContractGroups(),
      args: options,
      success: (args, data) => {
        data = data.contract_groups;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].contractId + ' ' + data[i].groupId);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new ContractGroupsCommand();
