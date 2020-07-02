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
  CRB_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/custom-rules/%s',
  SELECTED_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selected-hostnames',
  SELECTABLE_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selectable-hostnames',
  MATCH_TARGETS: '/appsec/v1/configs/%s/versions/%s/match-targets',
  MATCH_TARGET: '/appsec/v1/configs/%s/versions/%s/match-targets/%s',
  MATCH_TARGET_SEQUENCE: '/appsec/v1/configs/%s/versions/%s/match-targets/sequence',
  RATE_POLICIES: '/appsec/v1/configs/%s/versions/%s/rate-policies',
  RATE_POLICY: '/appsec/v1/configs/%s/versions/%s/rate-policies/%s',
  RATE_POLICIES_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rate-policies',
  RATE_POLICY_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rate-policies/%s',
  POLICY_PROTECTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/protections',
  SLOW_POST: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/slow-post',
  FIREWALL_POLICIES: '/appsec/v1/configs/%s/versions/%s/security-policies',
  API_ENDPOINTS: '/appsec/v1/configs/%s/versions/%s/api-endpoints',
  EXPORT: '/appsec/v1/export/configs/%s/versions/%s',
  MODE: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/mode',
  PENALTY_BOX: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/penalty-box',
  ATTACK_GROUPS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/attack-groups',
  ATTACK_GROUP: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/attack-groups/%s',
  ATTACK_GROUP_EXCEPTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/attack-groups/%s/condition-exception',
  RULE_CONDITION_EXCEPTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rules/%d/condition-exception',
  RULE_ACTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rules',
  RULE_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rules/%d'
};

define('URIS', resources);
define('logger', logger);
