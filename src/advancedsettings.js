'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class AdvancedSettings {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  /* **** HTTP Header Logging **** */

  getLogging() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_HTTP_HEADER_LOGGING, [policyId]);
      });
    }
    return this._version.readResource(URIs.HTTP_HEADER_LOGGING, []);
  }

  disableLogging() {
    let data = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/httpheaderlogging.json', 'utf8')
    );

    data.allowSampling = false;
    return this._version.updateResource(URIs.HTTP_HEADER_LOGGING, [], data);
  }

  enableLogging() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
        data.allowSampling = true;
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(URIs.HTTP_HEADER_LOGGING, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  disableOverrideLogging() {
    return this._policyProvider.policyId().then(policyId => {
      let data = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/securitypolicyhttpheaderlogging.json', 'utf8')
      );

      data.override = false;
      return this._version.updateResource(
        URIs.SECURITY_POLICY_HTTP_HEADER_LOGGING,
        [policyId],
        data
      );
    });
  }

  enableOverrideLogging() {
    if (fs.existsSync(this._options['file'])) {
      return this._policyProvider.policyId().then(policyId => {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;
        try {
          data = JSON.parse(payload);
          data.override = true;
        } catch (err) {
          throw 'The input JSON is not valid';
        }
        return this._version.updateResource(
          URIs.SECURITY_POLICY_HTTP_HEADER_LOGGING,
          [policyId],
          data
        );
      });
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  /* **** Prefetch Requests **** */

  getPrefetch() {
    return this._version.readResource(URIs.PREFETCH, []);
  }

  updatePrefetch() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(URIs.PREFETCH, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  /* **** Pragma Headers **** */

  getPragmaHeader() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_PRAGMA_HEADER, [policyId]);
      });
    }
    return this._version.readResource(URIs.PRAGMA_HEADER, []);
  }

  updatePragmaHeader() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      if (this._options.policy) {
        return this._policyProvider.policyId().then(policyId => {
          return this._version.updateResource(URIs.SECURITY_POLICY_PRAGMA_HEADER, [policyId], data);
        });
      }
      return this._version.updateResource(URIs.PRAGMA_HEADER, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  /* **** Request Body (Request Size Inspection Limit) **** */

  getRequestBody() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_REQUEST_BODY, [policyId]);
      });
    }
    return this._version.readResource(URIs.REQUEST_BODY, []);
  }

  updateRequestBody() {
    let payload = { requestBodyInspectionLimitInKB: this._options.inspectionlimit };

    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(URIs.SECURITY_POLICY_REQUEST_BODY, [policyId], payload);
      });
    }
    return this._version.updateResource(URIs.REQUEST_BODY, [], payload);
  }

  /* **** Evasive Path Match **** */

  getEvasivePathMatch() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_EVASIVE_PATH_MATCH, [policyId]);
      });
    }
    return this._version.readResource(URIs.EVASIVE_PATH_MATCH, []);
  }

  updateEvasivePathMatch(enable) {
    let data = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/evasivepathmatch.json', 'utf8')
    );
    data.enablePathMatch = enable;
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(
          URIs.SECURITY_POLICY_EVASIVE_PATH_MATCH,
          [policyId],
          data
        );
      });
    }
    return this._version.updateResource(URIs.EVASIVE_PATH_MATCH, [], data);
  }

  /* **** API PII Learning **** */

  getApiPiiLearning() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_API_PII_LEARNING, [policyId]);
      });
    }
    return this._version.readResource(URIs.API_PII_LEARNING, []);
  }

  updateApiPiiLearning(enable) {
    let data = JSON.parse(fs.readFileSync(__dirname + '/../templates/apipiilearning.json', 'utf8'));
    data.enablePiiLearning = enable;
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(
          URIs.SECURITY_POLICY_API_PII_LEARNING,
          [policyId],
          data
        );
      });
    }
    return this._version.updateResource(URIs.API_PII_LEARNING, [], data);
  }

  /* **** Attack Payload Logging **** */

  getAttackPayloadLogging() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_ATTACK_PAYLOAD_LOGGING, [policyId]);
      });
    }
    return this._version.readResource(URIs.ATTACK_PAYLOAD_LOGGING, []);
  }

  enableAttackPayloadLogging() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;

      try {
        data = JSON.parse(payload);
        data.enabled = true;
      } catch (err) {
        throw 'The input JSON is not valid';
      }

      return this._version.updateResource(URIs.ATTACK_PAYLOAD_LOGGING, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  disableAttackPayloadLogging() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;

      try {
        data = JSON.parse(payload);
        data.enabled = false;
      } catch (err) {
        throw 'The input JSON is not valid';
      }

      return this._version.updateResource(URIs.ATTACK_PAYLOAD_LOGGING, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  updateAttackPayloadLogging() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }

      return this._version.updateResource(URIs.ATTACK_PAYLOAD_LOGGING, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  enableAttackPayloadLoggingOverride() {
    return this._policyProvider.policyId().then(policyId => {
      if (fs.existsSync(this._options['file'])) {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;

        try {
          data = JSON.parse(payload);
          data.override = true;
        } catch (err) {
          throw 'The input JSON is not valid';
        }

        return this._version.updateResource(
          URIs.SECURITY_POLICY_ATTACK_PAYLOAD_LOGGING,
          [policyId],
          data
        );
      } else {
        throw `The file does not exists: ${this._options['file']}`;
      }
    });
  }

  disableAttackPayloadLoggingOverride() {
    return this._policyProvider.policyId().then(policyId => {
      if (fs.existsSync(this._options['file'])) {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;

        try {
          data = JSON.parse(payload);
          data.override = false;
        } catch (err) {
          throw 'The input JSON is not valid';
        }

        return this._version.updateResource(
          URIs.SECURITY_POLICY_ATTACK_PAYLOAD_LOGGING,
          [policyId],
          data
        );
      } else {
        throw `The file does not exists: ${this._options['file']}`;
      }
    });
  }

  updateAttackPayloadLoggingOverride() {
    return this._policyProvider.policyId().then(policyId => {
      if (fs.existsSync(this._options['file'])) {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;

        try {
          data = JSON.parse(payload);
        } catch (err) {
          throw 'The input JSON is not valid';
        }

        return this._version.updateResource(
          URIs.SECURITY_POLICY_ATTACK_PAYLOAD_LOGGING,
          [policyId],
          data
        );
      } else {
        throw `The file does not exists: ${this._options['file']}`;
      }
    });
  }
}

module.exports = {
  advancedsettings: AdvancedSettings
};
