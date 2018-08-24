'use strict';
var fs = require('fs');
var logger = require('../src/constants').logger('EdgeClient');
var URIs = require('../src/constants').URIS;
let util = require('util');

var MOCK_DATA = {};
MOCK_DATA[URIs.GET_CONFIGS] = './mock/configs.json';
MOCK_DATA[URIs.GET_VERSIONS] = './mock/versions.json';

class Edge {
  constructor(options) {
    let auth = {
      path: options.edgerc ? options.edgerc : '~/.edgerc',
      section: options.section ? options.section : 'appsec',
      debug: false,
      default: true
    };
    logger.debug(JSON.stringify(auth));
    console.log('::::: MOCK API ENABLED :::::');
    this._activationStatusCallCount = 0;
  }

  _resolveParams(uri, params) {
    for (let i = 0; params && i < params.length; i++) {
      uri = util.format(uri, params[i]);
    }
    return uri;
  }

  _send(request) {
    return new Promise((resolve, reject) => {
      let path = request.path.replace('/appsec/v1/', '');
      logger.debug('replaced path: ' + path);
      if (path.indexOf('?') !== -1) {
        path = path.substring(0, path.indexOf('?'));
      }
      path = __dirname + '/' + path + '.json';
      logger.debug('replaced path: ' + path);
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          logger.debug(JSON.stringify(JSON.parse(data)));
          setTimeout(() => {
            let jsonData = JSON.parse(data);

            //temporary activation call-only logic
            if (path.indexOf('/activations/status/') != -1) {
              if (this._activationStatusCallCount > 1) {
                jsonData.responseToChoose = 2;
              }
              this._activationStatusCallCount++;
            }

            let chosenData = jsonData.responses[jsonData.responseToChoose];
            if (chosenData.httpStatus >= 200 && chosenData.httpStatus < 400) {
              resolve(chosenData.response);
            } else {
              reject(JSON.stringify(chosenData.response));
            }
          }, 1000);
        }
      });
    });
  }

  get(requestUri, params) {
    let request = {
      method: 'GET',
      path: this._resolveParams(requestUri, params)
    };
    logger.debug(JSON.stringify(request));
    return this._send(request);
  }

  post(requestUri, payload, params) {
    let request = {
      method: 'POST',
      path: this._resolveParams(requestUri, params),
      followRedirect: false,
      body: payload
    };
    logger.debug(JSON.stringify(request));
    return this._send(request);
  }

  put(requestUri, payload, params) {
    let request = {
      method: 'PUT',
      path: this._resolveParams(requestUri, params),
      body: JSON.stringify(payload)
    };
    logger.debug(JSON.stringify(request));
    return payload;
  }

  _sendUpdate(request) {
    return new Promise((resolve, reject) => {
      let path = request.path.replace('/appsec-configuration/v1/', '');
      path = path.replace('/appsec-resource/v1/', '');
      path = __dirname + '/' + path + '-' + request.method + '.json';
      logger.debug('replaced path: ' + path);
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          logger.debug(JSON.stringify(JSON.parse(data)));
          setTimeout(() => {
            let jsonData = JSON.parse(data);
            let chosenData = jsonData.responses[jsonData.responseToChoose];
            if (chosenData.httpStatus >= 200 && chosenData.httpStatus < 400) {
              resolve(chosenData.response);
            } else {
              reject(chosenData.response);
            }
          }, 500);
        }
      });
    });
  }
}

module.exports = Edge;
