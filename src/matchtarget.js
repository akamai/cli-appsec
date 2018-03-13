'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('MatchTarget');
let Version = require('./versionsprovider').versionProvider;
let fs = require('fs');
const TEMPLATE_PATH = __dirname + '/../templates/matchtarget.json';

class MatchTarget {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._matchTarget = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
    //this._matchTargetType = this._options.type ? this._options.type : 'website';
    this._matchTargetType = 'website';
  }

  matchtargets() {
    return this._version.readResource(URIs.MATCH_TARGETS, []).then(allMatchTargets => {
      let matchTargetToChange =
        this._matchTargetType == 'website' ? 'websiteTargets' : 'apiTargets';
      let existingMatchTargets = allMatchTargets.matchTargets[matchTargetToChange]; //fetch only the requested type. i.e, website or api
      logger.debug('Existing sequence: %s', JSON.stringify(existingMatchTargets));
      return existingMatchTargets;
    });
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
        logger.debug('Updated match target: %s', JSON.stringify(matchTarget));
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
    logger.debug('Result sequence: %s', JSON.stringify(targetSequence));
    return this._version.updateResource(URIs.MATCH_TARGET_SEQUENCE, [], {
      targetSequence: targetSequence,
      type: this._matchTargetType
    });
  }

  _move(targetId, moveFunc) {
    logger.debug('Inserting the match target at the beginning.');
    return this.matchtargets().then(existingMatchTargets => {
      existingMatchTargets.sort((a, b) => {
        return a.sequence - b.sequence;
      });
      logger.debug('Match targets ordered by sequence: %s', JSON.stringify(existingMatchTargets));
      let targetSequence = [];
      for (let i = 0; i < existingMatchTargets.length; i++) {
        targetSequence.push(existingMatchTargets[i].targetId);
      }

      targetSequence = moveFunc(targetId, targetSequence);
      logger.debug('Result sequence: %s', JSON.stringify(targetSequence));

      return this._updateOrder(targetSequence);
    });
  }
  /**
   * Does ordering mased on the parameter passed.
   */
  changeSequence() {
    if (this._options.order && this._options.order.length) {
      return this._updateOrder(this._options.order); // this is a request for changing the order of match targets
    } else if (this._options.insert) {
      return this._move(this._options.insert, this._moveToStart.bind(this));
    } else if (this._options.append) {
      return this._move(this._options.append, this._moveToEnd.bind(this));
    }
  }

  /**
   * Helper to move the target id to the start
   * @param {*} targetId
   * @param {*} targetList
   */
  _moveToStart(targetId, targetList) {
    let result = targetList.filter(item => item != targetId);
    result.unshift(targetId);
    return result;
  }

  /**
   * Helper to move the target id to the end
   * @param {*} targetId
   * @param {*} targetList
   */
  _moveToEnd(targetId, targetList) {
    let result = targetList.filter(item => item != targetId);
    result.push(targetId);
    return result;
  }
}

module.exports = {
  matchTarget: MatchTarget
};
