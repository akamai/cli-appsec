'use strict';
let untildify = require('untildify');
var EdgeGrid = require('akamai-edgegrid');
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

    this._accountKey = options['account-key'] || options['accountkey'];
    if (!this._accountKey) {
      logger.debug('Account key not provided');
    } else {
      this._accountKey = encodeURIComponent(this._accountKey);
      logger.debug('Account Key : ' + this._accountKey);
    }
  }

  _resolveParams(uri, params) {
    for (let i = 0; params && i < params.length; i++) {
      uri = util.format(uri, params[i]);
    }
    if (this._accountKey) {
      if (uri.includes('?')) {
        uri = uri.concat('&accountSwitchKey=' + this._accountKey);
      } else {
        uri = uri.concat('?accountSwitchKey=' + this._accountKey);
      }
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
      this._edge.send(function(data, response, body) {
        logger.debug(
          request.method +
            ' : ' +
            request.path +
            '; Body: ' +
            request.body +
            '; Response : ' +
            JSON.stringify(body)
        );
        if (response && response.status >= 200 && response.status < 400) {
          if (body) {
            // DELETE calls don't have a body and throw errors when parsing.
            body = JSON.parse(body);
          }
          // Temp fix for long activation. Remove when long activation is fixed
          if (response.status == 202 || response.status == 303) {
            body.statusCode = response.status;
            body.headers = response.headers;
          }
          // Response
          resolve(body);
        } else if (response && response.status == 504) {
          reject('The request is taking longer than expected.');
        } else if (!response) {
          logger.info('No response from server: ', data);
          let errorText = '';
          if (data && data.response) {
            errorText = `\nStatus: ${data.response.status} - ${data.response.statusText} \n`;
            if (data.response.data) {
              errorText += `Details: ${JSON.stringify(data.response.data, null, 2)}`;
            }
          }
          reject(`Could not get data at this time. ${errorText}`);
        } else {
          try {
            logger.error('Error response from server: ', JSON.stringify(response, null, 2));
            logger.error('Body: ', JSON.stringify(JSON.parse(body), null, 2));
          } catch (err) {
            // Do nothing
          }

          try {
            let errJson = JSON.parse(body);
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
