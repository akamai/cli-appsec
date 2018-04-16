let out = require('./lib/out');
let Version = require('../../src/versionsprovider').versionProvider;
let util = require('util');
class VersionsCommand {
  constructor() {
    this.flags = 'versions';
    this.desc = 'List all config versions';
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
      .number('--limit <num>', {
        desc:
          'Specifies the number of most recent versions of the selected configuration to be fetched.',
        group: 'Options:',
        required: false
      })
      .boolean('--verbose', {
        desc: 'Provides more details about each version.',
        group: 'Options:',
        required: false
      });
  }

  run(options) {
    out.print({
      promise: new Version(options).versions(),
      args: options,
      success: (args, data) => {
        let nl = require('os').EOL;
        let res = [];
        if (args.verbose) {
          //prepare the verbose output
          for (let i = 0; i < data.versionList.length; i++) {
            if (data.versionList[i].basedOn) {
              res.push(
                util.format(
                  '%s.%s -> %s - %s',
                  data.configId,
                  data.versionList[i].version,
                  data.versionList[i].basedOn || '',
                  data.configName
                )
              );
            } else {
              res.push(
                util.format(
                  '%s.%s - %s',
                  data.configId,
                  data.versionList[i].version,
                  data.configName
                )
              );
            }
            res.push(
              util.format('%s at %s', data.versionList[i].createdBy, data.versionList[i].createDate)
            );
            res.push(
              util.format(
                'Staging: %s Production: %s',
                data.versionList[i].staging.status,
                data.versionList[i].production.status
              )
            );
            if (data.versionList[i].versionNotes) {
              res.push(util.format('Notes: %s', data.versionList[i].versionNotes));
            }
            res.push(''); //for an empty line
          }
        } else {
          for (let i = 0; i < data.versionList.length; i++) {
            res.push(data.versionList[i].version);
          }
        }
        return res.join(nl);
      }
    });
  }
}

module.exports = new VersionsCommand();
