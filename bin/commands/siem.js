let out = require('./lib/out');
let SIEM = require('../../src/siemsettings').siemSettings;

const objectType = 'siemDefinitions';

class SIEMDefCommand {
  constructor() {
    this.flags = 'siem-definitions';
    this.desc = 'List all siem definitions.';
    this.run = this.run.bind(this);
  }

  run(options) {
    out.print({
      promise: new SIEM(options).getSIEMDefinitions(),
      args: options,
      objectType,
      success: (args, data) => {
        let str = [];
        data[objectType].forEach(siem => {
          str.push(siem.id + ' ' + siem.name);
        });
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SIEMDefCommand();
