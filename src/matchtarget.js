'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let Version = require('./versionsprovider').versionProvider;
let fs = require('fs');
const TEMPLATE_PATH = __dirname + '/../templates/matchtarget.json';

class MatchTarget {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._matchTarget = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
    this._matchTargetType = this._options.type ? this._options.type : 'website';
  }

  createMatchTarget() {
    this._matchTarget.firewallPolicy.policyId = this._options.policy;
    this._matchTarget.hostnames = this._options.hostnames;
    this._matchTarget.filePaths = this._options.paths;

    return this._version.createResource(URIs.MATCH_TARGETS, [], this._matchTarget);
  }

  addHostnames() {
    return this._version
      .readResource(URIs.MATCH_TARGET, [this._options['match-target']])
      .then(matchTarget => {
        matchTarget.hostnames = [].concat(matchTarget.hostnames);
        for (let i = 0; i < this._options.hostnames.length; i++) {
          matchTarget.hostnames.push(this._options.hostnames[i]);
        }
        logger.debug('Updated match target: ' + JSON.stringify(matchTarget));
        return this._version.updateResource(
          URIs.MATCH_TARGET,
          [this._options['match-target']],
          matchTarget
        );
      });
  }

  _updateOrder(targetIdsInOrder) {
    let targetSequence = [];
    for (let i = 0; i < targetIdsInOrder.length; i++) {
      targetSequence.push({ targetId: targetIdsInOrder[i], sequence: i + 1 });
    }
    logger.debug('Result sequence: ' + JSON.stringify(targetSequence));
    return this._version.updateResource(URIs.MATCH_TARGET_SEQUENCE, [], {
      targetSequence: targetSequence,
      type: this._matchTargetType
    });
  }

  _insertBeginning() {
    logger.debug('Inserting the match target at the beginning.');
    return this._version.readResource(URIs.MATCH_TARGETS, []).then(allMatchTargets => {
      //collect all existing match targets
      let targetSequence = [];
      let matchTargetToChange =
        this._matchTargetType == 'website' ? 'websiteTargets' : 'apiTargets';
      let existingMatchTargets = allMatchTargets.matchTargets[matchTargetToChange]; //fetch only the requested type. i.e, website or api
      for (let i = 0; i < existingMatchTargets.length; i++) {
        targetSequence.push({
          targetId: existingMatchTargets[i].targetId,
          sequence: existingMatchTargets[i].sequence
        });
      }
      logger.debug('Existing sequence: ' + JSON.stringify(targetSequence));
      //create new list of match targets
      let result = [];
      result.push({ targetId: this._insert, sequence: 1 });
      for (let i = 0; i < targetSequence.length; i++) {
        result.push({
          targetId: targetSequence[i].targetId,
          sequence: targetSequence[i].sequence + 1
        });
      }
      logger.debug('REsult sequence: ' + JSON.stringify(targetSequence));
      return this._version.updateResource(URIs.MATCH_TARGET_SEQUENCE, [], {
        targetSequence: result,
        type: this._matchTargetType
      });
    });
  }

  changeSequence() {
    let targetIdsInOrder = this._options.order ? this._options.order : this.options._;
    if (targetIdsInOrder.length) {
      return this._updateOrder(targetIdsInOrder); // this is a request for changing the order of match targets
    } else if (this._options.insert) {
      return this._insertBeginning();
    }
  }
}

module.exports = {
  matchTarget: MatchTarget
};
