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
  GET_CONTRACT_GROUPS: '/appsec/v1/contracts-groups',
  GET_VERSIONS: '/appsec/v1/configs/%s/versions?detail=true',
  GET_VERSION: '/appsec/v1/configs/%s/versions/%s',
  GET_CRB_ALL: '/appsec/v1/configs/%s/custom-rules',
  GET_CRB: '/appsec/v1/configs/%s/custom-rules/%s',
  GET_ACTIVATION: '/appsec/v1/activations/%s',
  ACTIVATE_VERSION: '/appsec/v1/activations',
  CRB_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/custom-rules/%s',
  SELECTED_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selected-hostnames',
  SELECTABLE_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/selectable-hostnames',
  CONTRACT_SELECTABLE_HOSTS_RESOURCE: '/appsec/v1/contracts/%s/groups/%s/selectable-hostnames',
  FAILOVER_HOSTS_RESOURCE: '/appsec/v1/configs/%s/failover-hostnames',
  SIEM_RESOURCE: '/appsec/v1/configs/%s/versions/%s/siem',
  SIEM_DEF_RESOURCE: '/appsec/v1/siem-definitions',
  MATCH_TARGETS: '/appsec/v1/configs/%s/versions/%s/match-targets',
  MATCH_TARGET: '/appsec/v1/configs/%s/versions/%s/match-targets/%s',
  MATCH_TARGET_SEQUENCE: '/appsec/v1/configs/%s/versions/%s/match-targets/sequence',
  RATE_POLICIES: '/appsec/v1/configs/%s/versions/%s/rate-policies',
  REPUTATION_PROFILES: '/appsec/v1/configs/%s/versions/%s/reputation-profiles',
  RATE_POLICY: '/appsec/v1/configs/%s/versions/%s/rate-policies/%s',
  REPUTATION_PROFILE: '/appsec/v1/configs/%s/versions/%s/reputation-profiles/%s',
  RATE_POLICIES_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rate-policies',
  RATE_POLICY_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rate-policies/%s',
  POLICY_PROTECTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/protections',
  SLOW_POST: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/slow-post',
  FIREWALL_POLICIES: '/appsec/v1/configs/%s/versions/%s/security-policies',
  FIREWALL_POLICY: '/appsec/v1/configs/%s/versions/%s/security-policies/%s',
  API_ENDPOINTS: '/appsec/v1/configs/%s/versions/%s/api-endpoints',
  API_CONSTRAINT: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/api-request-constraints',
  API_ID_CONSTRAINT:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/api-request-constraint/%s',
  SECURITY_POLICY_API_ENDPOINTS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/api-endpoints',
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
  RULE_UPGRADE_DETAILS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rules/upgrade-details',
  RULE_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/rules/%d',
  EVAL_RULE_ACTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-rules',
  EVAL_RULE_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-rules/%d',
  EVAL_RULE_CONDITION_EXCEPTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-rules/%d/condition-exception',
  EVAL_MODE: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval',
  IP_GEO_FIREWALL: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/ip-geo-firewall',
  REPUTATION_PROFILE_ACTIONS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/reputation-profiles',
  REPUTATION_PROFILE_ACTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/reputation-profiles/%d',
  REPUTATION_ANALYSIS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/reputation-analysis',
  CUSTOM_DENY: '/appsec/v1/configs/%s/versions/%s/custom-deny',
  CUSTOM_DENY_BY_ID: '/appsec/v1/configs/%s/versions/%s/custom-deny/%s',
  HTTP_HEADER_LOGGING: '/appsec/v1/configs/%s/versions/%s/advanced-settings/logging',
  PREFETCH: '/appsec/v1/configs/%s/versions/%s/advanced-settings/prefetch',
  SECURITY_POLICY_HTTP_HEADER_LOGGING:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/advanced-settings/logging'
};

define('URIS', resources);
define('logger', logger);
