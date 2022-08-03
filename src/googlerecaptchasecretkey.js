'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class GoogleRecaptchaSecretKey {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  updateGoogleRecaptchaSecretKey() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.GOOGLE_RECAPTCHA_SECRET_KEY,
        [this._options['action_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  googlerecaptchasecretkey: GoogleRecaptchaSecretKey
};
