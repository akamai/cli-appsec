let out = require('./lib/out');
let SIEM = require('../../src/siemsettings').siemSettings;

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
      success: (args, data) => {
        data = data.siemDefinitions;
        let str = [];
        for (let i = 0; data && i < data.length; i++) {
          str.push(data[i].id + ' ' + data[i].name);
        }
        return str.join(require('os').EOL);
      }
    });
  }
}

module.exports = new SIEMDefCommand();
