function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

const LOG = require('pino')({
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'fatal',
  prettyPrint: true,
  name: 'app-sec'
});
let logger = function(loggerName) {
  return LOG.child({ name: loggerName });
};
const resources = {
  GET_CONFIGS: '/appsec/v1/configs',
  GET_CONFIG: '/appsec/v1/configs/%s',
  CLONE: '/appsec/v1/configs/%s/versions',
  GET_VERSIONS: '/appsec/v1/configs/%s/versions?detail=true',
  GET_VERSION: '/appsec/v1/configs/%s/versions/%s',
  GET_CRB_ALL: '/appsec/v1/configs/%s/custom-rules',
  GET_CRB: '/appsec/v1/configs/%s/custom-rules/%s',
  GET_ACTIVATION: '/appsec/v1/activations/%s',
  ACTIVATE_VERSION: '/appsec/v1/activations',
  CRB_ACTION: '/appsec/v1/configs/%s/versions/%s/firewall-policies/%s/custom-rules/%s',
  SELECTED_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selected-hostnames',
  SELECTABLE_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selectable-hostnames',
  MATCH_TARGETS: '/appsec/v1/configs/%s/versions/%s/match-targets',
  MATCH_TARGET: '/appsec/v1/configs/%s/versions/%s/match-targets/%s',
  MATCH_TARGET_SEQUENCE: '/appsec/v1/configs/%s/versions/%s/match-targets/sequence',
  FIREWALL_POLICIES: '/appsec/v1/configs/%s/versions/%s/firewall-policies'
};

define('URIS', resources);
define('logger', logger);
