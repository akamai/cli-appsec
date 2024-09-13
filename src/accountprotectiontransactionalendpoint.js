'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class AccountProtectionTransactionalEndpoint {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getTransactionalEndpointList() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_TRANSACTIONAL_ENDPOINTS, []);
  }

  getTransactionalEndpointById() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_TRANSACTIONAL_ENDPOINT_BY_ID, [
      this._options['operation_id']
    ]);
  }

  addTransactionalEndpoints() {
    if (!fs.existsSync(untildify(this._options['file']))) {
      throw `File ( ${this._options['file']} ) does not exists.`;
    }
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    let data;
    try {
      data = JSON.parse(payload);
    } catch (err) {
      throw `Request payload from file ( ${this._options['file']} ) is not valid json.`;
    }
    return this._policy.createResource(URIs.ACCOUNT_PROTECTION_TRANSACTIONAL_ENDPOINTS, [], data);
  }

  updateTransactionalEndpoint() {
    if (!fs.existsSync(untildify(this._options['file']))) {
      throw `File ( ${this._options['file']} ) does not exists.`;
    }
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    let data;
    try {
      data = JSON.parse(payload);
    } catch (err) {
      throw `Request payload from file ( ${this._options['file']} ) is not valid json.`;
    }
    return this._policy.updateResource(
      URIs.ACCOUNT_PROTECTION_TRANSACTIONAL_ENDPOINT_BY_ID,
      [this._options['operation_id']],
      data
    );
  }

  deleteTransactionalEndpoint() {
    return this._policy.deleteResource(URIs.ACCOUNT_PROTECTION_TRANSACTIONAL_ENDPOINT_BY_ID, [
      this._options['operation_id']
    ]);
  }
}

module.exports = {
  accountProtectionTransactionalEndpoint: AccountProtectionTransactionalEndpoint
};
