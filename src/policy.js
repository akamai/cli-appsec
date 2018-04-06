'use strict';

let URIs = require('./constants').URIS;
//let logger = require('./constants').logger('FirewallPolicy');
let Version = require('./versionsprovider').versionProvider;

class FirewallPolicy {
  constructor(options) {
    this._version = new Version(options);
    this._options = options;
  }

  policies() {
    return this._version.readResource(URIs.FIREWALL_POLICIES, []);
  }

  /**
   * Provides policy id. If the policy ID is not provided by the user, tries to fetch the policy from server.
   * If there are more than one policy, an error is thrown.
   */
  policyId() {
    if (this._options.policy) {
      return Promise.resolve(this._options.policy);
    } else {
      return this.policies().then(policiesObject => {
        if (policiesObject.policies.length > 1) {
          throw 'You have more than one security policy. Please provide a policy to work with.';
        } else {
          return Promise.resolve(policiesObject.policies[0].policyId);
        }
      });
    }
  }
  /**
   * Reads resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/firewall-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  readResource(uri, params) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this.this._version.readResource(uri, params);
    });
  }

  /**
   * Updates resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/firewall-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  updateResource(uri, params, payload) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this.this._version.updateResource(uri, params, payload);
    });
  }

  /**
   * Creates resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/firewall-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  createResource(uri, params, payload) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this.this._version.createResource(uri, params, payload);
    });
  }
}

module.exports = {
  policy: FirewallPolicy
};
