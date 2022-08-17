'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class TransactionalEndpoint {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getTransactionalEndpointList() {
    return this._policy.readResource(URIs.TRANSACTIONAL_ENDPOINTS, []);
  }

  addTransactionalEndpoint() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.createResource(URIs.TRANSACTIONAL_ENDPOINTS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getTransactionalEndpoint() {
    return this._policy.readResource(URIs.TRANSACTIONAL_ENDPOINT, [this._options['operation_id']]);
  }

  updateTransactionalEndpoint() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.TRANSACTIONAL_ENDPOINT,
        [this._options['operation_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteTransactionalEndpoint() {
    return this._policy.deleteResource(URIs.TRANSACTIONAL_ENDPOINT, [
      this._options['operation_id']
    ]);
  }
}

module.exports = {
  transactionalendpoint: TransactionalEndpoint
};
