'use strict';
let untildify = require("untildify");
var EdgeGrid = require("edgeGrid");
var logger = require("pino")({
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
  prettyPrint:true,
  name:"EdgeClient"
});
class Edge {
  constructor(auth = {
    path: "~/.edgerc",
    section: "appsec",
    debug: false,
    default: true
  }) {
    if (auth.clientToken && auth.clientSecret && auth.accessToken && auth.host) {
      this._edge = new EdgeGrid(auth.clientToken, auth.clientSecret, auth.accessToken, auth.host, auth.debug);
    } else {
      this._edge = new EdgeGrid({
        path: untildify(auth.path),
        section: auth.section,
        debug: auth.debug
      });
    }
  }

  get(request) {
    return new Promise((resolve, reject) => {
      this._edge.auth(request);
      this._edge.send(function (data, response) {
        logger.debug("Response from server: " + JSON.stringify(response));
        if (response && response.statusCode >= 200 && response.statusCode < 400) {
          resolve(JSON.parse(response.body));
        } else if(!response) {
          logger.info("Error response from server: "+JSON.stringify(data));
          reject("Could not get configurations at this time.");
        } else {
          logger.info("Error response from server: "+JSON.stringify(response));
          try  {
            let errJson = JSON.parse(response.body);
            reject(errJson.detail);
          } catch(err) {
            reject(response.body);
          }
        }
      });
    });
  }
}

module.exports = Edge;