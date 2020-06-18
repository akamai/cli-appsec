'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class AttackGroups {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getAttackGroupActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.ATTACK_GROUPS, [policyId]);
    });
  }

  getAttackGroupAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.ATTACK_GROUP, [policyId, this._options['group']]);
    });
  }

  enableAttackGroup() {
    return this._policyProvider.policyId().then(policyId => {
      let json = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      json.action = this._options['action'];
      return this._version.updateResource(
        URIs.ATTACK_GROUP,
        [policyId, this._options['group']],
        json
      );
    });
  }

  disableAttackGroup() {
    return this._policyProvider.policyId().then(policyId => {
      let json = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      json.action = 'none';
      return this._version.updateResource(
        URIs.ATTACK_GROUP,
        [policyId, this._options['group']],
        json
      );
    });
  }

  getAttackGroupException() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.ATTACK_GROUP_EXCEPTION, [
        policyId,
        this._options['group']
      ]);
    });
  }

  updateAttackGroupException() {
    return this._policyProvider.policyId().then(policyId => {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      return this._version.updateResource(
        URIs.ATTACK_GROUP_EXCEPTION,
        [policyId, this._options['group']],
        payload
      );
    });
  }
}

module.exports = {
  attackGroups: AttackGroups
};
