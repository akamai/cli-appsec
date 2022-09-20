'use strict';

let URIs = require('./constants').URIS;
//let logger = require('./constants').logger('FirewallPolicy');
let Version = require('./versionsprovider').versionProvider;
let fs = require('fs');
let untildify = require('untildify');

class FirewallPolicy {
  constructor(options) {
    this._version = new Version(options);
    this._options = options;
  }

  policies() {
    return this._version.readResource(URIs.FIREWALL_POLICIES, []);
  }

  clonePolicy() {
    let payload = { createFromSecurityPolicy: this._options.policy };
    if (this._options.name) {
      payload.policyName = this._options.name;
    }
    if (this._options.prefix) {
      payload.policyPrefix = this._options.prefix;
    }
    return this._version.createResource(URIs.FIREWALL_POLICIES, [], payload);
  }

  createPolicy() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.FIREWALL_POLICIES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  modifyPolicy() {
    let payload = { policyId: this._options.policy };
    if (this._options.name) {
      payload.policyName = this._options.name;
    }

    return this.policyId().then(policyId => {
      return this._version.updateResource(URIs.FIREWALL_POLICY, [policyId], payload);
    });
  }

  deletePolicy() {
    return this.policyId().then(policyId => {
      return this._version.deleteResource(URIs.FIREWALL_POLICY, [policyId]);
    });
  }

  getPolicy() {
    return this.policyId().then(policyId => {
      return this._version.readResource(URIs.FIREWALL_POLICY, [policyId]);
    });
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
   * Reads resources tied to the security policy.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/security-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  readResource(uri, params) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this._version.readResource(uri, params);
    });
  }

  /**
   * Updates resources tied to the security policy.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/security-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  updateResource(uri, params, payload) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this._version.updateResource(uri, params, payload);
    });
  }

  /**
   * Creates resources tied to the security policy.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/security-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  createResource(uri, params, payload) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this._version.createResource(uri, params, payload);
    });
  }
  /**
   * Deletes resources tied to the security policy.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/security-policies/<id>
   * @param {*} params the parameters that gets substituted in the uri in order(except config id, version id and policy id)
   */
  deleteResource(uri, params) {
    return this.policyId().then(policyId => {
      params.unshift(policyId);
      return this._version.deleteResource(uri, params);
    });
  }
}

module.exports = {
  policy: FirewallPolicy
};
