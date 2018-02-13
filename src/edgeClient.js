'use strict';
let untildify = require('untildify');
var EdgeGrid = require('edgeGrid');
let util = require("util");
let logger = require("./constants").logger("EdgeClient");
class Edge {
  constructor(
    auth = {
      path: '~/.edgerc',
      section: 'appsec',
      debug: false,
      default: true
    }
  ) {
    if (auth.clientToken && auth.clientSecret && auth.accessToken && auth.host) {
      this._edge = new EdgeGrid(
        auth.clientToken,
        auth.clientSecret,
        auth.accessToken,
        auth.host,
        auth.debug
      );
    } else {
      this._edge = new EdgeGrid({
        path: untildify(auth.path),
        section: auth.section,
        debug: auth.debug
      });
    }
  }

  _resolveParams(uri,params) {
    for (let i = 0; params && i < params.length; i++) {
      uri = util.format(uri, params[i]);
    }
    return uri;
  }

  _send(request) {
    return new Promise((resolve, reject) => {
      this._edge.auth(request);
      this._edge.send(function (data, response) {
        logger.debug(request.method + " : " + request.path 
          + "; Body: "+ request.body
          + "; Response : " + JSON.stringify(response));
        if (response && response.statusCode >= 200 && response.statusCode < 400) {
          resolve(JSON.parse(response.body));
        } else if(!response) {
          logger.info("No response from server: "+JSON.stringify(data));
          reject("Could not get data at this time.");
        } else {
          logger.info("Error response from server: "+JSON.stringify(response));
          try  {
            let errJson = JSON.parse(response.body);
            reject(errJson.detail?errJson.detail:errJson.title);
          } catch(err) {
            reject(response.body);
          }
        }
      });
    });
  }

  get(requestUri, params) {

    let request = {
      method: "GET",
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
      method: "PUT",
      path: this._resolveParams(requestUri, params),
      body: JSON.stringify(payload)
    };
    return this._send(request);
  }
}

module.exports = Edge;