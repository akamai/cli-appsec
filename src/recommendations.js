'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class Recommendations {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
    this.type = !!this._options.type?.length ? this._options.type : 'active';
  }

  getRecommendations() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RECOMMENDATIONS, [policyId, this.type]);
    });
  }

  getRuleRecommendations() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RULE_RECOMMENDATIONS, [
        policyId,
        this._options['rule']
      ]);
    });
  }

  getGroupRecommendations() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.GROUP_RECOMMENDATIONS, [
        policyId,
        this._options['group'],
        this.type
      ]);
    });
  }

  postRecommendation() {
    return this._policyProvider.policyId().then(policyId => {
      let rec = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/recommendation.json', 'utf8')
      );
      rec.action = this._options['action'];
      rec.selectorId = this._options['selectorId'];
      return this._version.createResource(URIs.RECOMMENDATIONS, [policyId], rec);
    });
  }
}

module.exports = {
  recommendations: Recommendations
};
