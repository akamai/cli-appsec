'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('MatchTarget');
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

let fs = require('fs');
const TEMPLATE_PATH = __dirname + '/../templates/matchtarget.json';
const API_TEMPLATE_PATH = __dirname + '/../templates/apimatchtarget.json';

class MatchTarget {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._matchTarget = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
    this._apiMatchTarget = JSON.parse(fs.readFileSync(API_TEMPLATE_PATH, 'utf8'));
    //this._matchTargetType = this._options.type ? this._options.type : 'website';
    this._matchTargetType = 'website';
    this._policyProvider = new PolicyProvider(options);
  }

  matchtargets() {
    return this._version.readResource(URIs.MATCH_TARGETS, []).then(allMatchTargets => {
      let existingMatchTargets = [];
      if (this._options.type) {
        let matchTargetToChange = this._options.type == 'website' ? 'websiteTargets' : 'apiTargets';
        existingMatchTargets = allMatchTargets.matchTargets[matchTargetToChange]; //fetch only the requested type. i.e, website or api
      } else {
        existingMatchTargets = allMatchTargets.matchTargets['websiteTargets'];
        existingMatchTargets = existingMatchTargets.concat(
          allMatchTargets.matchTargets['apiTargets']
        );
      }
      logger.debug('Existing sequence: %s', JSON.stringify(existingMatchTargets));
      return { matchTargets: existingMatchTargets };
    });
  }

  getMatchTarget() {
    return this._version.readResource(URIs.MATCH_TARGET, [this._options['match-target']]);
  }

  createMatchTarget() {
    return this._policyProvider.policyId().then(policyId => {
      this._matchTarget.securityPolicy.policyId = policyId;
      this._matchTarget.hostnames = this._options.hostnames;
      this._matchTarget.filePaths = this._options.paths;

      return this._version.createResource(URIs.MATCH_TARGETS, [], this._matchTarget);
    });
  }

  createApiMatchTarget() {
    return this._policyProvider.policyId().then(policyId => {
      this._apiMatchTarget.securityPolicy.policyId = policyId;
      let inputApis = this._options.apis;
      this._apiMatchTarget.apis = [];
      for (let i = 0; i < inputApis.length; i++) {
        if (!Number.isInteger(inputApis[i])) {
          throw 'Must provide at least 1 API, API list has to be valid.';
        }
        this._apiMatchTarget.apis.push({ id: inputApis[i] });
      }

      return this._version.createResource(URIs.MATCH_TARGETS, [], this._apiMatchTarget);
    });
  }

  deleteMatchTarget() {
    return this._version.deleteResource(URIs.MATCH_TARGET, [this._options['match-target']]);
  }

  addHostnames() {
    return this._version
      .readResource(URIs.MATCH_TARGET, [this._options['match-target']])
      .then(matchTarget => {
        if (!matchTarget.hostnames) {
          matchTarget.hostnames = [];
        }
        for (let i = 0; i < this._options.hostnames.length; i++) {
          matchTarget.hostnames.push(this._options.hostnames[i]);
        }
        delete matchTarget.validations;
        logger.debug('Updated match target: %s', JSON.stringify(matchTarget));
        return this._version.updateResource(
          URIs.MATCH_TARGET,
          [this._options['match-target']],
          matchTarget
        );
      });
  }

  removeHostname() {
    return this._version
      .readResource(URIs.MATCH_TARGET, [this._options['match-target']])
      .then(matchTarget => {
        matchTarget.hostnames = matchTarget.hostnames || [];
        let hostExists = false;
        for (let i = 0; i < matchTarget.hostnames.length; i++) {
          if (matchTarget.hostnames[i] === this._options.hostname) {
            matchTarget.hostnames.splice(i, 1);
            hostExists = true;
            break;
          }
        }
        if (!hostExists) {
          throw 'The specified hostname not present in the match target';
        }

        delete matchTarget.validations;
        logger.debug('Updated match target: %s', JSON.stringify(matchTarget));
        return this._version.updateResource(
          URIs.MATCH_TARGET,
          [this._options['match-target']],
          matchTarget
        );
      });
  }

  addApi() {
    return this._version
      .readResource(URIs.MATCH_TARGET, [this._options['match-target']])
      .then(matchTarget => {
        if (!matchTarget.apis) {
          matchTarget.apis = [];
        }
        let apiExists = false;
        for (let i = 0; i < matchTarget.apis.length; i++) {
          if (matchTarget.apis[i].id == this._options.api) {
            apiExists = true;
            break;
          }
        }
        if (!apiExists) {
          matchTarget.apis.push({ id: this._options.api });
        }
        delete matchTarget.validations;
        logger.debug('Updated match target: %s', JSON.stringify(matchTarget));
        return this._version.updateResource(
          URIs.MATCH_TARGET,
          [this._options['match-target']],
          matchTarget
        );
      });
  }

  removeApi() {
    return this._version
      .readResource(URIs.MATCH_TARGET, [this._options['match-target']])
      .then(matchTarget => {
        matchTarget.apis = matchTarget.apis || [];
        let apiExists = false;
        for (let i = 0; i < matchTarget.apis.length; i++) {
          if (matchTarget.apis[i].id == this._options.api) {
            matchTarget.apis.splice(i, 1);
            apiExists = true;
            break;
          }
        }
        if (!apiExists) {
          throw 'The specified api not present in the match target';
        }
        delete matchTarget.validations;
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
    return this.matchtargets().then(matchTargetsObj => {
      let existingMatchTargets = matchTargetsObj.matchTargets;
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
    if (this._options.order && this._options.order[0]) {
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
