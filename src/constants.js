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
  GET_CONFIGS: '/appsec-configuration/v1/configs',
  GET_CONFIG: '/appsec-configuration/v1/configs/%s',
  GET_VERSIONS: '/appsec-configuration/v1/configs/%s/versions?detail=true',
  GET_VERSION: '/appsec-configuration/v1/configs/%s/versions/%s',
  GET_CRB_ALL: '/appsec-resource/v1/configs/%s/custom-rules',
  GET_CRB: '/appsec-resource/v1/configs/%s/custom-rules/%s',
  CRB_ACTION:
    '/appsec-configuration/v1/configs/%s/versions/%s/firewall-policies/%s/custom-rules/%s/action',
  SELECTED_HOSTS_RESOURCE: '/appsec-configuration/v1/configs/%s/versions/%s/selected-hostnames',
  SELECTABLE_HOSTS_RESOURCE: '/appsec-configuration/v1/configs/%s/versions/%s/selectable-hostnames',
  MATCH_TARGETS: '/appsec-configuration/v1/configs/%s/versions/%s/match-targets',
  MATCH_TARGET: '/appsec-configuration/v1/configs/%s/versions/%s/match-targets/%s',
  MATCH_TARGET_SEQUENCE: '/appsec-configuration/v1/configs/%s/versions/%s/match-targets/sequence',
  FIREWALL_POLICIES: '/appsec-configuration/v1/configs/%s/versions/%s/firewall-policies'
};

define('URIS', resources);
define('logger', logger);
