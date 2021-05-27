'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let Version = require('./versionsprovider').versionProvider;
let Config = require('./configprovider').configProvider;
let PolicyProvider = require('./policy').policy;
let fs = require('fs');
let untildify = require('untildify');

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

const Mode = {
  APPEND: 'append',
  REMOVE: 'remove',
  REPLACE: 'replace'
};

class SelectedHosts {
  constructor(options) {
    this._config = new Config(options);
    this._version = new Version(options);
    this._policy = new PolicyProvider(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._edge = new Edge(options);
  }

  addHosts() {
    logger.debug('Adding hosts to selected list.');
    return this._version.readResource(URIs.SELECTED_HOSTS_RESOURCE, []).then(selectedHosts => {
      let hosts = [];
      if (!selectedHosts || !selectedHosts.hostnameList) {
        selectedHosts = { hostnameList: [] };
      }
      logger.info('Adding hosts to the list: ' + JSON.stringify(selectedHosts.hostnameList));
      hosts = selectedHosts.hostnameList;
      for (let i = 0; i < this._options.hostnames.length; i++) {
        hosts.push({ hostname: this._options.hostnames[i] });
      }
      return this._version.updateResource(URIs.SELECTED_HOSTS_RESOURCE, [], selectedHosts);
    });
  }

  modifyHosts() {
    return this._config.getTargetProduct().then(targetProduct => {
      if (fs.existsSync(this._options['file'])) {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;
        try {
          data = JSON.parse(payload);
        } catch (err) {
          throw 'The input JSON is not valid';
        }
        data.mode = this._options.append
          ? Mode.APPEND
          : this._options.remove
          ? Mode.REMOVE
          : Mode.REPLACE;
        return targetProduct === 'KSD'
          ? this._version.updateResource(URIs.SELECTED_HOSTS_RESOURCE, [], data)
          : this._policy.updateResource(URIs.SELECTED_HOSTS_RESOURCE_WAP, [], data);
      }
    });
  }

  selectableHosts() {
    if (this._options.contract && this._options.config) {
      throw `Wrong arguments. config is not a valid argument with contract.`;
    }

    if (this._options.contract && this._options.version) {
      throw `Wrong arguments. version is not a valid argument with contract.`;
    }

    if (this._options.config && this._options.group) {
      throw `Wrong arguments. group is not a valid argument with config.`;
    }

    if (this._options.version && this._options.group) {
      throw `Wrong arguments. group is not a valid argument with version.`;
    }

    if (this._options.contract && !this._options.group) {
      throw `group is mandatory with contract argument.`;
    }

    if (this._options.contract) {
      return this._edge.get(URIs.CONTRACT_SELECTABLE_HOSTS_RESOURCE, [
        this._options['contract'],
        this._options['group']
      ]);
    } else {
      return this._version.readResource(URIs.SELECTABLE_HOSTS_RESOURCE, []);
    }
  }

  selectedHosts() {
    return this._version.readResource(URIs.SELECTED_HOSTS_RESOURCE, []);
  }

  evalHosts() {
    return this._version.readResource(URIs.EVAL_HOSTS_RESOURCE, []);
  }

  updateEvalHosts() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(URIs.EVAL_HOSTS_RESOURCE, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  protectEvalHosts() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(URIs.PROTECT_EVAL_HOSTS_RESOURCE, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  failoverHosts() {
    return this._config.readResource(URIs.FAILOVER_HOSTS_RESOURCE, []);
  }
}

module.exports = {
  selectedHosts: SelectedHosts,
  mode: Mode
};
