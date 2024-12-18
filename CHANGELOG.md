## 3.1.0 (December 2024 Release)

- New Commands:
  - `account-protection-transactional-endpoint-list`               Display List of all account protected transactional endpoints.
  - `account-protection-transactional-endpoint`                    Get a transactional endpoint by operation id for account protection.
  - `create-account-protection-transactional-endpoint-list`        Create List of transactional endpoints for account protection.
  - `modify-account-protection-transactional-endpoint`             Update a transactional endpoint for account protection.
  - `delete-account-protection-transactional-endpoint`             Delete a account protected transactional endpoint.
  - `account-protection-settings`                                  Display account protection settings for a security policy.
  - `modify-account-protection-settings`                           Modify account protection settings for a security policy.
  - `account-protection-transactional-endpoint-protection`         Display account protected advanced settings for transactional endpoints.
  - `modify-account-protection-transactional-endpoint-protection`  Modify account protected advanced settings for transactional endpoints.
  - `account-protection-user-allow-list-id`                        Display user allow list id for account protection.
  - `modify-account-protection-user-allow-list-id`                 Modify user allow list id for account protection.
  - `delete-account-protection-user-allow-list-id`                 Delete user allow list id for account protection.
  - `account-protection-risk-actions`                              Display allowed risk actions for account protected endpoints.

## 3.0.0 (August 2024 Release)

- New Commands:
  - `custom-bot-category-item-sequence` Display contents of custom bot category item sequence.
  - `modify-custom-bot-category-item-sequence` Update existing custom bot category item sequence.
  - `content-protection-javascript-injection-rule-list` Display contents of content protection javascript injection rules.
  - `content-protection-javascript-injection-rule` Display contents of content protection javascript injection rule.
  - `create-content-protection-javascript-injection-rule` Create a content protection javascript injection rule.
  - `modify-content-protection-javascript-injection-rule` Update a content protection JavaScript injection rule.
  - `delete-content-protection-javascript-injection-rule` Delete a content protection JavaScript injection rule.

## 2.9.0 (February 2024 Release)

- CLI Enhancements
  - "--debug" flag support to log output in the debug mode
- New Commands:
  - `custom-client-sequence` command displays custom client sequence.
  - `modify-custom-client-sequence` command modifies an existing custom client sequence.
  - `content-protection-rule` command displays contents of content protection rule.
  - `content-protection-detections` command displays content protection detections.
  - `content-protection-rule-detection-settings` command displays overridden detection settings of content protection rule.
  - `content-protection-rule-list` command lists all content protection rules.
  - `content-protection-rule-sequence` command displays contents of content bot category sequence.
  - `create-content-protection-rule` command creates a content protection rule.
  - `delete-content-protection-rule` command deletes a content protection rule.
  - `modify-content-protection-rule` command updates content protection rule.
  - `modify-content-protection-rule-detection-settings` command updates detection settings of content protection rule.
  - `modify-content-protection-rule-sequence` command updates existing content protection rule sequence.
  - `penalty-box-conditions` command displays conditions of penalty box.
  - `create-penalty-box-conditions` command creates conditions of penalty box.
  - `modify-penalty-box-conditions` command modifies conditions of penalty box.
  - `delete-penalty-box-conditions` command deletes conditions of penalty box.
  - `eval-penalty-box-conditions` command displays conditions of evaluation penalty box.
  - `create-eval-penalty-box-conditions` command creates conditions of evaluation penalty box.
  - `modify-eval-penalty-box-conditions` command modifies conditions of evaluation penalty box.
  - `delete-eval-penalty-box-conditions` command deletes conditions of evaluation penalty box.
- Templates:
  - Adding `clientListMatch` sample object in crbTemplate.json

## 2.8.0 (June 2023 release)

- New Commands:
  - `api-pii-learning` command displays API PII settings.
  - `attack-payload-logging` command displays attack payload logging settings.
  - `challenge-injection-rules` command displays contents of challenge injection rules.
  - `disable-api-pii-learning` command disables API PII learning settings.
  - `disable-attack-payload-logging` command disables attack payload logging settings.
  - `disable-override-attack-payload-logging` command disables attack payload logging override settings.
  - `enable-api-pii-learning` command enables API PII learning settings.
  - `enable-attack-payload-logging` command enables attack payload logging settings.
  - `enable-override-attack-payload-logging` command enables attack payload logging override settings.
  - `modify-attack-payload-logging` command modifies an existing attack payload logging settings.
  - `modify-challenge-injection-rules` command updates existing challenge injection rules.
  - `modify-override-attack-payload-logging` command modifies attack payload logging override settings for an existing policy.
- Deprecated Commands:
  - `challenge-interception-rules` command displays contents of challenge interception rules.
  - `modify-challenge-interception-rules` command updates existing challenge interception rules.

## 2.7.0 (September 2022 Release)

- New Commands:

  - `eval-penalty-box` command displays evaluation penalty box action in a policy.
  - `disable-eval-penalty-box` command disables evaluation penalty box in a policy.
  - `enable-eval-penalty-box` command enables evaluation penalty box in a policy.
  - `malware-policies` command lists all malware policies.
  - `malware-policy` command displays contents of a malware policy.
  - `modify-malware-policy`command modifies an existing malware policy.
  - `create-malware-policy` command creates a malware policy.
  - `delete-malware-policy` command deletes an existing malware policy.
  - `malware-policies-actions` command displays all enabled malware policy actions.
  - `disable-malware-policy` command removes actions to an existing malware policy in a firewall policy.
  - `enable-malware-policy` command assigns actions to an existing malware policy in a firewall policy.
  - `malware-content-types` command lists all malware content types.
  - Moving BOTMAN CLI commands -
    - `akamai-bot-category` command displays contents of akamai bot category.
    - `akamai-bot-category-action` command displays contents of akamai bot category action.
    - `modify-akamai-bot-category-action` command updates existing akamai bot category action.
    - `akamai-bot-category-action-list` command lists all akamai bot category action.
    - `akamai-bot-category-list` command lists all akamai bot category.
    - `akamai-defined-bot` command displays contents of akamai defined bot.
    - `akamai-defined-bot-list` command lists all akamai defined bot.
    - `bot-analytics-cookie` command displays contents of bot analytics cookie.
    - `modify-bot-analytics-cookie` command updates existing bot analytics cookie.
    - `bot-analytics-cookie-values`command displays contents of bot analytics cookie values.
    - `bot-detection` command displays contents of bot detection.
    - `bot-detection-action` command displays contents of bot detection action.
    - `modify-bot-detection-action` command updates existing bot detection action.
    - `bot-detection-action-list` command lists all bot detection action.
    - `bot-detection-list` command lists all bot detection.
    - `bot-endpoint-coverage-report` command displays contents of bot endpoint coverage report.
    - `bot-endpoint-coverage-report-config-version` command displays contents of bot endpoint coverage report - config version.
    - `bot-management-settings`command displays contents of bot management settings.
    - `modify-bot-management-settings` command updates existing bot management settings.
    - `bot-protection-exceptions`command displays contents of bot protection exceptions.
    - `modify-bot-protection-exceptions` command updates existing bot protection exceptions.
    - `create-challenge-action` command creates a challenge action.
    - `delete-challenge-action` command deletes a challenge action.
    - `challenge-action` command displays contents of challenge action.
    - `modify-challenge-action` command updates existing challenge action.
    - `challenge-action-list` command lists all challenge action.
    - `challenge-interception-rules` command displays contents of challenge interception rules.
    - `modify-challenge-interception-rules` command updates existing challenge interception rules.
    - `client-side-security` command displays contents of client side security.
    - `modify-client-side-security` command updates existing client side security.
    - `create-conditional-action` command creates a conditional action.
    - `delete-conditional-action` command deletes a conditional action.
    - `conditional-action` command displays contents of conditional action.
    - `modify-conditional-action` command updates existing conditional action.
    - `conditional-action-list` command lists all conditional action.
    - `create-custom-bot-category` command creates a custom bot category.
    - `delete-custom-bot-category` command deletes a custom bot category.
    - `custom-bot-category` command displays contents of custom bot category.
    - `modify-custom-bot-category` command updates existing custom bot category.
    - `custom-bot-category-action` command displays contents of custom bot category action.
    - `modify-custom-bot-category-action` command updates existing custom bot category action.
    - `custom-bot-category-action-list` command lists all custom bot category action.
    - `custom-bot-category-list` command lists all custom bot category.
    - `custom-bot-category-sequence` command displays contents of custom bot category sequence.
    - `modify-custom-bot-category-sequence` command updates existing custom bot category sequence.
    - `create-custom-client` command creates a custom client.
    - `delete-custom-client` command deletes a custom client.
    - `custom-client` command displays contents of custom client.
    - `modify-custom-client` command updates existing custom client.
    - `custom-client-list` command lists all custom client.
    - `create-custom-defined-bot` command creates a custom defined bot.
    - `delete-custom-defined-bot` command deletes a custom defined bot.
    - `custom-defined-bot` command displays contents of custom defined bot.
    - `modify-custom-defined-bot` command updates existing custom defined bot.
    - `custom-defined-bot-list` command lists all custom defined bot.
    - `create-custom-deny-action` command creates a custom deny action.
    - `delete-custom-deny-action` command deletes a custom deny action.
    - `custom-deny-action` command displays contents of custom deny action.
    - `modify-custom-deny-action` command updates existing custom deny action.
    - `custom-deny-action-list` command lists all custom deny action.
    - `modify-google-recaptcha-secret-key`command updates existing google recaptcha secret key.
    - `javascript-injection-rules` command displays contents of javascript injection rules.
    - `modify-javascript-injection-rules` command updates existing javascript injection rules.
    - `create-recategorized-akamai-defined-bot`command creates a recategorized akamai defined bot.
    - `delete-recategorized-akamai-defined-bot`command deletes a recategorized akamai defined bot.
    - `recategorized-akamai-defined-bot` command displays contents of recategorized akamai defined bot.
    - `modify-recategorized-akamai-defined-bot` command updates existing recategorized akamai defined bot.
    - `recategorized-akamai-defined-bot-list` command lists all recategorized akamai defined bot.
    - `response-actions-list` command lists all response actions.
    - `rotate-bot-analytics-cookie-values` command rotates bot analytics cookie values.
    - `create-serve-alternate-action` command creates a serve alternate action.
    - `delete-serve-alternate-action` command deletes a serve alternate action.
    - `serve-alternate-action` command displays contents of serve alternate action.
    - `modify-serve-alternate-action` command updates existing serve alternate action.
    - `serve-alternate-action-list` command lists all serve alternate action.
    - `create-transactional-endpoint` command creates a transactional endpoint.
    - `delete-transactional-endpoint` command deletes a transactional endpoint.
    - `transactional-endpoint` command displays contents of transactional endpoint.
    - `modify-transactional-endpoint` command updates existing transactional endpoint.
    - `transactional-endpoint-list` command lists all transactional endpoint.
    - `transactional-endpoint-protection` command displays contents of transactional endpoint protection.
    - `modify-transactional-endpoint-protection` command updates existing transactional endpoint protection.

- CLI Enhancements
  - Adding "--type" parameter to recommendations command:
    - Description:Use to get active or evaluation or all recommendations. Supported values are active|evaluation|all. If type not provided, default is active
    - Usage: `akamai appsec recommendations --type=active`
    - Usage: `akamai appsec recommendations CMD --type=active`
  - Supporting "--accountkey" flag to switch the account when performing the operation
- Fixing security vulnerabilities

## 2.6.0 (February 2022 Release)

- New Command:
  - `activation-history` command lists activation history for the configuration

## 2.5.0 (January 2022 Release)

- New Command:
  - `evasive-path-match` command displays the evasive path match settings
  - `enable-evasive-path-match` command enables evasive path match settings
  - `disable-evasive-path-match` command disable evasive path match settings

## 2.4.0 (August 2021 Release)

- New Command:
  - `recommendations` command displays recommendations in a policy
  - `accept-recommendation` command accepts a recommendation
  - `decline-recommendation` command declines a recommendation
  - `reset-recommendation` command resets a recommendation
- Renaming `start-eval` command parameter - `mode` to `eval-mode`

## 2.3.0 (July 2021 Release)

- WAP Plus support for selected-hostnames, modify-hostnames, and network-lists
- Added "mode" parameter to support ASE (Auto and Manual) for the "start-eval" command
- Added "threat-intel", "enable-threat-intel", and "disable-threat-intel" commands
- Support for including hostnames ("--include-hostnames") and contract-group ("--include-contract-group") in the "configs" command

## 2.2.0 (May 2021 Release)

- CLI Enhancements - adding "--query", "--fields", "--raw", and "--sort" flags.
  - --query:
    - Description: Query to use for filtering the response and can be comma separated multiple fields.
    - Usage: `akamai appsec configs --query name=CLI*,targetProduct=KSD`
  - --fields:
    - Description: Fields to be displayed from the response and can be comma separated multiple fields.
    - Usage: `akamai appsec configs --fields id,name,targetProduct`
  - --raw:
    - Description: Use to get fields in raw format (requires "--fields" argument).
    - Usage: `akamai appsec configs --fields id,name,targetProduct --raw`
  - --sort:
    - Description: Use for the sorting the response. [Default: asc (ascending)]
    - Usage: `akamai appsec configs --fields id,name,targetProduct --sort id,desc`
- Adding option to specify "rule-update" flag while cloning a config version
- New Command:
  - `modify-hostnames`: Modify hostnames for the configuration version
- Bugfixes:
  - When all hostnames are selected for the website match-target, command will return "ALL_HOSTNAMES" (instead of "undefined")
  - `modify-bypass-network-lists` command will return all the network lists instead of JSON (when --json option is not provided)
  - `create-security-policy` command will return policyId instead of JSON (when --json option is not provided)

## 2.1.0 (April 2021 Release)

- Commands:
  - Pragma header (list and modify)
  - Remove hosts for the match-targets

## 2.0.0

- Fixing security vulnerabilities
- Support for host and TLS fingerprint match conditions for the custom rules

## 1.9.0

- BETA Commands
