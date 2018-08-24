'use strict';
let untildify = require('untildify');
var EdgeGrid = require('edgegrid');
let util = require('util');
let logger = require('./constants').logger('EdgeClient');
let version = require('../package.json').version;
let fs = require('fs');
class Edge {
  constructor(options) {
    let auth = {
      path: options.edgerc ? options.edgerc : '~/.edgerc',
      section: options.section ? options.section : 'appsec',
      debug: false,
      default: true
    };
    logger.debug('Auth details: ' + JSON.stringify(auth));
    //If the user did not specify a section and if 'appsec' is missing, we use the 'default' section
    if (!options.section) {
      let exp = new RegExp('^\\s*\\[' + auth.section + '\\]\\s*$', 'm');
      let authFileData = fs.readFileSync(untildify(auth.path), 'utf8');
      if (!exp.test(authFileData)) {
        logger.debug('Section not found. Defaulting to "default"');
        auth.section = 'default';
      }
    }

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
    let headers = request.headers || {};
    headers['Client-App'] = 'appsec-cli-' + version;
    request.headers = headers;
    return new Promise((resolve, reject) => {
      logger.debug('Request: %s', JSON.stringify(request));
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
          let body = response.body;
          if (response.body) {
            //delete calls don't have a body and throw errors when parsing.
            body = JSON.parse(response.body);
          } else {
            //promise needs to call resolve and resolve() returns "undefined"
            body = response.body;
          }
          //Temp fix for long activation. Remove when long activation is fixed
          if (response.statusCode == 202 || response.statusCode == 303) {
            body.statusCode = response.statusCode;
            body.headers = response.headers;
          }
          /////
          resolve(body);
        } else if (response && response.statusCode == 504) {
          reject('The request is taking longer than expected.');
        } else if (!response) {
          logger.info('No response from server: ', data);
          reject('Could not get data at this time.');
        } else {
          try {
            logger.error('Error response from server: ', JSON.stringify(response, null, 2));
            logger.error('Body: ', JSON.stringify(JSON.parse(response.body), null, 2));
          } catch (err) {
            //do nothing
          }

          try {
            let errJson = JSON.parse(response.body);
            reject(errJson);
          } catch (err) {
            reject({ detail: 'Unknown Error' });
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

  delete(requestUri, params) {
    let request = {
      method: 'DELETE',
      path: this._resolveParams(requestUri, params)
    };
    return this._send(request);
  }

  post(requestUri, body, params) {
    let request = {
      method: 'POST',
      path: this._resolveParams(requestUri, params),
      followRedirect: false,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return this._send(request);
  }

  put(requestUri, payload, params) {
    let request = {
      method: 'PUT',
      path: this._resolveParams(requestUri, params),
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return this._send(request);
  }
}

module.exports = Edge;
