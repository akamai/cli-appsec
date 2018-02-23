'use strict';
let untildify = require('untildify');
var EdgeGrid = require('edgeGrid');
let util = require('util');
let logger = require('./constants').logger('EdgeClient');
class Edge {
  constructor(options) {
    let auth = {
      path: options.edgerc ? options.edgerc : '~/.edgerc',
      section: options.section ? options.section : 'default',
      debug: false,
      default: true
    };
    logger.debug('Auth details: ' + JSON.stringify(auth));
    this._edge = new EdgeGrid({
      path: untildify(auth.path),
      section: auth.section,
      debug: auth.debug
    });
  }

  _resolveParams(uri, params) {
    for (let i = 0; params && i < params.length; i++) {
      uri = util.format(uri, params[i]);
    }
    return uri;
  }

  _send(request) {
    return new Promise((resolve, reject) => {
      this._edge.auth(request);
      this._edge.send(function(data, response) {
        logger.debug(
          request.method +
            ' : ' +
            request.path +
            '; Body: ' +
            request.body +
            '; Response : ' +
            JSON.stringify(response)
        );
        if (response && response.statusCode >= 200 && response.statusCode < 400) {
          resolve(JSON.parse(response.body));
        } else if (!response) {
          logger.info('No response from server: ' + JSON.stringify(data));
          reject('Could not get data at this time.');
        } else {
          logger.error('Error response from server: ' + JSON.stringify(response, null, 2));
          logger.error('Body: ' + JSON.stringify(JSON.parse(response.body), null, 2));
          try {
            let errJson = JSON.parse(response.body);
            reject(errJson);
          } catch (err) {
            reject({ error: response.body });
          }
        }
      });
    });
  }

  get(requestUri, params) {
    let request = {
      method: 'GET',
      path: this._resolveParams(requestUri, params)
    };
    return this._send(request);
  }

  post(requestUri, body, params) {
    let request = {
      method: 'POST',
      path: this._resolveParams(requestUri, params),
      followRedirect: false,
      body: body
    };
    return this._send(request);
  }

  put(requestUri, payload, params) {
    let request = {
      method: 'PUT',
      path: this._resolveParams(requestUri, params),
      body: JSON.stringify(payload)
    };
    return this._send(request);
  }
}

module.exports = Edge;
