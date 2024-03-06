'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
const untildify = require('untildify');
//Ensures user can add paths like '~/foo'
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class EvalPenaltyBoxConditions {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getEvalPenaltyBoxConditions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.EVAL_PENALTY_BOX_CONDITIONS, [policyId]);
    });
  }

  updateEvalPenaltyBoxConditions() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(URIs.EVAL_PENALTY_BOX_CONDITIONS, [policyId], data);
      });
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteEvalPenaltyBoxConditions() {
    return this._policyProvider.policyId().then(policyId => {
      let evalPenaltyBoxConditions = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/eval-penalty-box-conditions.json', 'utf8')
      );

      return this._version.updateResource(
        URIs.EVAL_PENALTY_BOX_CONDITIONS,
        [policyId],
        evalPenaltyBoxConditions
      );
    });
  }
}

module.exports = {
  evalPenaltyBoxConditions: EvalPenaltyBoxConditions
};
