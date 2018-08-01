'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');

let logger = require('./constants').logger('Activation');
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');
let Version = require('./versionsprovider').versionProvider;
let Config = require('./configprovider').configProvider;
class Activation {
  constructor(options) {
    this._edge = new Edge(options);
    this._version = new Version(options);
    this._config = new Config(options);
    this._options = options;
  }

  getStatus() {
    return this._edge.get(URIs.GET_ACTIVATION, [this._options['activation-id']]);
  }

  activate() {
    let activation = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/activation.json', 'utf8')
    );
    activation.network = this._options.network;
    if (this._options.note) {
      activation.note = this._options.note;
    }
    if (this._options.notify) {
      activation.notificationEmails = this._options.notify;
    }

    return this._config
      .getConfigId()
      .then(configId => {
        activation.activationConfigs[0].configId = configId;
        return this._version.getVersionNumber();
      })
      .then(version => {
        activation.activationConfigs[0].configVersion = version;
        logger.debug('Activation payload: %s', JSON.stringify(activation));
        return this._edge.post(URIs.ACTIVATE_VERSION, activation, []);
      })
      .then(response => {
        logger.debug('Response: ', response);
        if (response.statusId) {
          //we are not getting the http code at this point. So we check the body instead.
          //Response is asking us to try again using this ID
          return new Promise((resolve, reject) => {
            new ActivationResponseHandler(this._edge).handle(response.statusId, resolve, reject);
          });
        } else {
          return Promise.resolve(response);
        }
      });
  }
}

class ActivationResponseHandler {
  constructor(edge) {
    this._edge = edge;
  }
  handle(statusId, resolve, reject) {
    this._edge
      .get('/appsec/v1/activations/status/' + statusId, [])
      .then(response => {
        if (response.statusCode == 303) {
          let loc = response.headers.location;
          logger.info('Activation id available. Trying to fetch the object from:', loc);
          this._edge
            .get(loc, [])
            .then(response => {
              if (response.statusCode == 200) {
                logger.debug('Activation response:', response.body);
                resolve(response.body);
              } else {
                this.error(response, reject);
              }
            })
            .catch(err => {
              reject(err);
            });
        } else if (response.statusCode == 200) {
          logger.info('Activation id not available yet. Will retry after 2 seconds');
          setTimeout(
            function(edge) {
              new ActivationResponseHandler(edge).handle(statusId, resolve, reject);
            },
            10000,
            this._edge
          );
        } else {
          this.error(response, reject);
        }
      })
      .catch(err => {
        reject(err);
      });
  }

  error(response, reject) {
    if (response && response.statusCode == 504) {
      reject('The request is taking longer than expected.');
    } else if (!response) {
      logger.info('No response from server: ');
      reject('Could not get data at this time.');
    } else {
      try {
        logger.error('Error response from server: ', JSON.stringify(response, null, 2));
        logger.error('Body: ', JSON.stringify(JSON.parse(response.body), null, 2));
      } catch (err) {
        logger.error(err);
      }

      try {
        let errJson = JSON.parse(response.body);
        reject(errJson);
      } catch (err) {
        reject({ detail: 'Unknown Error' });
      }
    }
  }
}

module.exports = {
  activation: Activation
};
