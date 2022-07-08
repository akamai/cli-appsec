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
  GET_CONFIGS: '/appsec/v1/configs?includeHostnames=%s&includeContractGroup=%s',
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
  SELECTED_HOSTS_RESOURCE_WAP:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/selected-hostnames',
  EVAL_HOSTS_RESOURCE: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-hostnames',
  PROTECT_EVAL_HOSTS_RESOURCE:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/protect-eval-hostnames',
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
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/api-request-constraints/%s',
  SECURITY_POLICY_API_ENDPOINTS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/api-endpoints',
  EXPORT: '/appsec/v1/export/configs/%s/versions/%s',
  MODE: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/mode',
  PENALTY_BOX: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/penalty-box',
  EVAL_PENALTY_BOX: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-penalty-box',
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
  EVAL_GROUP_ACTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-groups',
  EVAL_GROUP_ACTION: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-groups/%s',
  EVAL_GROUP_CONDITION_EXCEPTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/eval-groups/%s/condition-exception',
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
  BYPASS_NETWORK_LIST:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/bypass-network-lists',
  HTTP_HEADER_LOGGING: '/appsec/v1/configs/%s/versions/%s/advanced-settings/logging',
  EVASIVE_PATH_MATCH: '/appsec/v1/configs/%s/versions/%s/advanced-settings/evasive-path-match',
  PREFETCH: '/appsec/v1/configs/%s/versions/%s/advanced-settings/prefetch',
  PRAGMA_HEADER: '/appsec/v1/configs/%s/versions/%s/advanced-settings/pragma-header',
  SECURITY_POLICY_PRAGMA_HEADER:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/advanced-settings/pragma-header',
  REQUEST_BODY: '/appsec/v1/configs/%s/versions/%s/advanced-settings/request-body',
  SECURITY_POLICY_REQUEST_BODY:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/advanced-settings/request-body',
  SECURITY_POLICY_HTTP_HEADER_LOGGING:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/advanced-settings/logging',
  SECURITY_POLICY_EVASIVE_PATH_MATCH:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/advanced-settings/evasive-path-match',
  VERSION_NOTES: '/appsec/v1/configs/%s/versions/%s/version-notes',
  HOSTNAME_COVERAGE: '/appsec/v1/hostname-coverage',
  HOSTNAME_COVERAGE_MATCH_TARGET:
    '/appsec/v1/configs/%s/versions/%s/hostname-coverage/match-targets?hostname=%s',
  HOSTNAME_COVERAGE_OVERLAPPING:
    '/appsec/v1/configs/%s/versions/%s/hostname-coverage/overlapping?hostname=%s',
  THREAT_INTEL: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/threat-intel',
  RECOMMENDATIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/recommendations?type=%s',
  RULE_RECOMMENDATIONS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/recommendations/rules/%s',
  GROUP_RECOMMENDATIONS:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/recommendations/attack-groups/%s?type=%s',
  ACTIVATION_HISTORY: '/appsec/v1/configs/%s/activations',
  MALWARE_POLICIES: '/appsec/v1/configs/%s/versions/%s/malware-policies',
  MALWARE_POLICY: '/appsec/v1/configs/%s/versions/%s/malware-policies/%s',
  MALWARE_POLICY_ACTIONS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/malware-policies',
  MALWARE_POLICY_ACTION:
    '/appsec/v1/configs/%s/versions/%s/security-policies/%s/malware-policies/%s',
  MALWARE_POLICY_CONTENT_TYPES: '/appsec/v1/configs/%s/versions/%s/malware-policies/content-types'
};

define('URIS', resources);
define('logger', logger);
