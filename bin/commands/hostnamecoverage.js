let HostnameCoverage = require('../../src/hostnamecoverage').hostnameCoverage;
let out = require('./lib/out');

class HostnameCoverageCommand {
  constructor() {
    this.flags = 'hostname-coverage';
    this.desc = 'Display the Hostname Coverage.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  hostnameCoveragelist(hostnameCoverage) {
    let hostnameCoverages = [];
    for (let i = 0; i < hostnameCoverage.length; i++) {
      let lineArray = [];
      let hostnameCoverageObject = hostnameCoverage[i];
      lineArray.push(hostnameCoverageObject.hostname);
      lineArray.push(hostnameCoverageObject.status);
      if (hostnameCoverageObject.configuration) {
        lineArray.push(hostnameCoverageObject.configuration.id);
        lineArray.push(hostnameCoverageObject.configuration.version);
      }
      lineArray.push(hostnameCoverageObject.hasMatchTarget ? 'has_criteria' : 'no_criteria');
      hostnameCoverages.push(lineArray.join(' '));
    }
    return hostnameCoverages.join(require('os').EOL);
  }

  hostnameCoverageMatchTarget(matchTargets) {
    let output = [];
    let apiTargets = matchTargets.apiTargets;
    let websiteTargets = matchTargets.websiteTargets;
    for (let i = 0; i < apiTargets.length; i++) {
      let lineArray = [];
      let apiTarget = apiTargets[i];
      lineArray.push(apiTarget.targetId);
      lineArray.push(apiTarget.type);
      output.push(lineArray.join(' '));
    }
    for (let i = 0; i < websiteTargets.length; i++) {
      let lineArray = [];
      let websiteTarget = websiteTargets[i];
      lineArray.push(websiteTarget.targetId);
      lineArray.push(websiteTarget.type);
      output.push(lineArray.join(' '));
    }
    return output.join(require('os').EOL);
  }

  hostnameCoverageOverlapping(overlappingList) {
    let output = [];
    if (overlappingList) {
      for (let i = 0; i < overlappingList.length; i++) {
        let lineArray = [];
        let overlap = overlappingList[i];
        lineArray.push(overlap.configId);
        lineArray.push(overlap.configVersion);
        lineArray.push(overlap.contractId);
        output.push(lineArray.join(' '));
      }
    }
    return output.join(require('os').EOL);
  }

  setup(sywac) {
    sywac
      .number('--config <id>', {
        desc:
          'Configuration ID. Mandatory if you have more than one configuration. ' +
          'This is only required if you are retrieving a Hostname Coverage Match Target or Overlapping List.',
        group: 'Options:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed. " +
          'This is only required if you are retrieving a Hostname Coverage Match Target or Overlapping List.',
        group: 'Options:',
        required: false
      })
      .boolean('--match-target', {
        desc: 'Get the hostname coverage match target.',
        group: 'Options:',
        required: false
      })
      .boolean('--overlapping', {
        desc: 'Get the hostname coverage overlapping list.',
        group: 'Options:',
        required: false
      })
      .string('--hostname <hostname>', {
        desc: 'The input host for match target or overlapping.',
        group: 'Options:',
        required: false
      });
  }
  run(options) {
    let objectType;
    if (options['match-target']) {
      objectType = 'matchTargets';
    } else if (options['overlapping']) {
      objectType = 'overLappingList';
    } else {
      objectType = 'hostnameCoverage';
    }
    out.print({
      promise: new HostnameCoverage(options).getHostnameCoverage(),
      args: options,
      objectType,
      success: (args, data) => {
        if (options['match-target']) {
          return this.hostnameCoverageMatchTarget(data);
        } else if (options['overlapping']) {
          return this.hostnameCoverageOverlapping(data);
        } else {
          return this.hostnameCoveragelist(data);
        }
      }
    });
  }
}

module.exports = new HostnameCoverageCommand();
