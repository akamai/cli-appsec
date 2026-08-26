'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class ScriptRule {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getScriptRules() {
    return this._policy.readResource(URIs.SCRIPT_RULES, []);
  }

  createScriptRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.createResource(URIs.SCRIPT_RULES, [], data);
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }

  updateScriptRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(URIs.SCRIPT_RULE, [this._options['rule-id']], data);
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }

  deleteScriptRule() {
    return this._policy.deleteResource(URIs.SCRIPT_RULE, [this._options['rule-id']]);
  }
}

module.exports = { scriptRule: ScriptRule };
