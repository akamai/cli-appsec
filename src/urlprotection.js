'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;

class URLProtection {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getURLProtectionRules() {
    return this._version.readResource(URIs.URL_PROTECTION_RULES, []);
  }

  getURLProtectionRule() {
    return this._version.readResource(URIs.URL_PROTECTION_RULE, [
      this._options['url-protection-rule']
    ]);
  }
}

module.exports = {
  urlProtection: URLProtection
};
