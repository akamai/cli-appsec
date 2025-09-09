# Akamai CLI for Application Security

*NOTE:* This tool is intended to be installed via the Akamai CLI package manager, which can be retrieved from the releases page of the [Akamai CLI](https://github.com/akamai/cli) tool.

### Local Install, if you choose not to use the akamai package manager
* Node 22
* npm install after *every* update
* Ensure that the 'bin' subdirectory is in your path

### Assumed Defaults
* Version number - if not specified, the tool will assume the latest version is editable and try to execute the actions on the version. If the version is not editable<sup>[1](#references)</sup>, you will get an error.
* Config ID - if not specified, the tool will make an assumption that the user has only one configuration and try to execute the action on the editable<sup>[1](#references)</sup> version.
* Security policy id - if not provided in commands that required a security policy, the tool will assume that the editable<sup>[1](#references)</sup> version has only one policy and try to use it. If the said version has more than one policy, an error will be thrown asking for the policy id.

If left to these assumptions, the commands will perform slower than when these options are provided explicitly.
### Credentials
In order to use this configuration, you need to:
* Set up your credential files as described in the [authorization](https://developer.akamai.com/introduction/Prov_Creds.html) and [credentials](https://developer.akamai.com/introduction/Conf_Client.html) sections of the getting started guide on developer.akamai.com.  
* When working through this process you need to give grants for the Application Security API.  The section in your configuration file should be called 'appsec' or 'default' unless you would like to pass the section name in every command using the `--section` option.

### Account Switching
Account switching can be performed by providing the `--account-key` option with account ID as the value.
* In order to use this capability, an API client needs to be setup. Detailed information is available here https://learn.akamai.com/en-us/learn_akamai/getting_started_with_akamai_developers/developer_tools/accountSwitch.html

## Overview
The akamai appsec Kit is a set of nodejs libraries that wraps Akamai's {OPEN} APIs to help simplify protection to the properties delivered by Akamai. This kit can be used [as a no-fuss command line utility](#akamai-appsec) to interact with the library.

```
$ akamai appsec
Usage: akamai appsec <command> [options]

Commands:
  accept-recommendation                                            Accept a recommendation.
  activate                                                         Activate a version.
  activation                                                       Get activation status.
  activation-history                                               List activation history for the configuration.
  account-protection-transactional-endpoint                        Get a transactional endpoint by operation id for account protection.
  account-protection-transactional-endpoint-list                   List all account protected transactional endpoints.
  get-account-protection-rule                                      Get an account protection rule in a policy.
  get-account-protection-rule-sequence                             Get sequence of account protection rules.
  list-account-protection-rules                                    List all account protection rules in a policy.
  account-protection-user-risk-response-strategy                   Display account protected advanced settings for user risk response strategy.
  [Deprecated] account-protection-transactional-endpoint-protection        Display account protected advanced settings for transactional endpoints.
  account-protection-settings                                      Display account protection settings for a security policy.
  account-protection-user-allow-list-id                            Display user allow list id for account protection.
  account-protection-risk-actions                                  Display allowed risk actions for account protected endpoints.
  akamai-bot-category                                              Display contents of akamai bot category.
  akamai-bot-category-action                                       Display contents of akamai bot category action.
  akamai-bot-category-action-list                                  List all akamai bot category action.
  akamai-bot-category-list                                         List all akamai bot category.
  akamai-defined-bot                                               Display contents of akamai defined bot.
  akamai-defined-bot-list                                          List all akamai defined bot.
  api-endpoints                                                    List all api endpoints.
  api-request-constraints-action                                   Display API Request Constraint action.
  api-pii-learning                                                 Display the API PII Learning settings.
  attack-group                                                     Display attack group action in a policy.
  attack-groups                                                    List all attack group actions in a policy.
  attackgroup-condition-exception                                  Display attack group exceptions.
  bot-analytics-cookie                                             Display contents of bot analytics cookie.
  bot-analytics-cookie-values                                      Display contents of bot analytics cookie values.
  bot-detection                                                    Display contents of bot detection.
  bot-detection-action                                             Display contents of bot detection action.
  bot-detection-action-list                                        List all bot detection action.
  bot-detection-list                                               List all bot detection.
  bot-endpoint-coverage-report                                     Display contents of bot endpoint coverage report.
  bot-endpoint-coverage-report-config-version                      Display contents of bot endpoint coverage report - config version.
  bot-management-settings                                          Display contents of bot management settings.
  bot-protection-exceptions                                        Display contents of bot protection exceptions.
  bypass-network-lists                                             List all bypass network lists.
  challenge-action                                                 Display contents of challenge action.
  challenge-action-list                                            List all challenge action.
  challenge-injection-rules                                        Display contents of challenge injection rules.
  client-side-security                                             Display contents of client side security.
  clone                                                            Clone a config.
  clone-policy                                                     Clone security policy.
  complete-eval                                                    Complete evaluation in a policy.
  conditional-action                                               Display contents of conditional action.
  conditional-action-list                                          List all conditional action.
  configs                                                          List all available configurations.
  content-protection-detections                                    Display content protection detections.
  content-protection-javascript-injection-rule-list                Display contents of content protection javascript injection rules.
  content-protection-javascript-injection-rule                     Display contents of content protection javascript injection rule.
  content-protection-rule                                          Display contents of content protection rule.
  content-protection-rule-detection-settings                       Display overridden detection settings of content protection rule.
  content-protection-rule-list                                     List all content protection rules.
  content-protection-rule-sequence                                 Display contents of content bot category sequence.
  contracts-groups                                                 List contracts and groups with KSD/WAP line items.
  create-api-match-target                                          Creates an API match target.
  create-account-protection-transactional-endpoint-list            Create List of transactional endpoints for account protection.
  create-account-protection-rule                                   Create an account protection rule in a policy.
  create-challenge-action                                          Create a challenge action.
  create-conditional-action                                        Create a conditional action.
  create-config                                                    Create a new security config.
  create-content-protection-rule                                   Create a content protection rule.
  create-content-protection-javascript-injection-rule              Create a content protection javascript injection rule.
  create-custom-bot-category                                       Create a custom bot category.
  create-custom-client                                             Create a custom client.
  create-custom-defined-bot                                        Create a custom defined bot.
  create-custom-deny                                               Create-custom-deny action.
  create-custom-deny-action                                        Create a custom deny action.
  create-custom-rule                                               Create a custom rule.
  create-eval-penalty-box-conditions                               Create evaluation penalty box conditions in a policy.
  create-malware-policy                                            Create a malware policy.
  create-match-target                                              Creates a website match target.
  create-penalty-box-conditions                                    Create penalty box conditions in a policy.
  create-rate-policy                                               Create a rate policy.
  create-recategorized-akamai-defined-bot                          Create a recategorized akamai defined bot.
  create-reputation-profile                                        Create a reputation profile.
  create-security-policy                                           Create a security policy.
  create-serve-alternate-action                                    Create a serve alternate action.
  create-transactional-endpoint                                    Create a transactional endpoint.
  custom-bot-category                                              Display contents of custom bot category.
  custom-bot-category-action                                       Display contents of custom bot category action.
  custom-bot-category-action-list                                  List all custom bot category action.
  custom-bot-category-list                                         List all custom bot category.
  custom-bot-category-sequence                                     Display contents of custom bot category sequence.
  custom-bot-category-item-sequence                                Display contents of custom bot category item sequence.
  custom-client                                                    Display contents of custom client.
  custom-client-list                                               List all custom client.
  custom-client-sequence                                           Display contents of custom client sequence.
  custom-defined-bot                                               Display contents of custom defined bot.
  custom-defined-bot-list                                          List all custom defined bot.
  custom-deny                                                      Display contents of custom deny action. 
  custom-deny-action                                               Display contents of custom deny action.
  custom-deny-action-list                                          List all custom deny action.
  custom-deny-list                                                 List all custom deny actions.
  custom-rule                                                      Display contents of custom rule.
  custom-rules                                                     List all custom rules.
  decline-recommendation                                           Decline a recommendation.
  delete-account-protection-transactional-endpoint                 Delete a account protected transactional endpoint.
  delete-account-protection-rule                                   Delete an account protection rule in a policy.
  delete-account-protection-user-allow-list-id                     Delete user allow list id for account protection.
  delete-challenge-action                                          Delete a challenge action.
  delete-conditional-action                                        Delete a conditional action.
  delete-config                                                    Delete a security config.
  delete-content-protection-rule                                   Delete a content protection rule.
  delete-content-protection-javascript-injection-rule              Delete a content protection JavaScript injection rule.
  delete-custom-bot-category                                       Delete a custom bot category.
  delete-custom-client                                             Delete a custom client.
  delete-custom-defined-bot                                        Delete a custom defined bot.
  delete-custom-deny                                               Delete a custom deny action.
  delete-custom-deny-action                                        Delete a custom deny action.
  delete-custom-rule                                               Delete a custom rule.
  delete-eval-penalty-box-conditions                               Delete evaluation penalty box conditions in a policy.
  delete-malware-policy                                            Delete an existing malware policy.
  delete-match-target                                              Deletes a match target.
  delete-penalty-box-conditions                                    Delete penalty box conditions in a policy.
  delete-rate-policy                                               Delete a rate policy.
  delete-recategorized-akamai-defined-bot                          Delete a recategorized akamai defined bot.
  delete-reputation-profile                                        Delete a reputation profile.
  delete-security-policy                                           Delete a security policy.
  delete-serve-alternate-action                                    Delete a serve alternate action.
  delete-transactional-endpoint                                    Delete a transactional endpoint.
  disable-api-request-constraints                                  Disable API Request Constraint.
  disable-attack-group                                             Disable attack group  in a policy.
  disable-eval-penalty-box                                         Disable evaluation penalty box in a policy.
  disable-eval-rule-action                                         Disable evaluation rule action in a policy.
  disable-evasive-path-match                                       Disable Evasive Path Match.
  disable-http-header-logging                                      Disable the HTTP Header Logging settings.
  disable-malware-policy                                           Remove actions to an existing malware policy in a firewall policy.
  disable-override-http-header-logging                             Disable the HTTP Header Logging Override settings.
  disable-penalty-box                                              Disable penalty box in a policy.
  disable-rate-policy                                              Removes an action set to an existing rate policy in a policy.
  disable-reputation-profile                                       Disable the action for a reputation profile.
  disable-rule-action                                              Disable rule action in a policy.
  disable-slow-post                                                Disable slow post in a policy.
  enable-api-request-constraints                                   Set the API Request Constraint action.
  enable-attack-group                                              Enable attack group in a policy.
  enable-custom-rule                                               Assigns an action (such as alert or deny) to an existing custom rule in a policy.
  enable-eval-penalty-box                                          Enable evaluation penalty box in a policy.
  enable-eval-rule-action                                          Enable evaluation rule action in a policy.
  enable-evasive-path-match                                        Enable Evasive Path Match.
  enable-http-header-logging                                       Enable the HTTP Header Logging settings.
  enable-malware-policy                                            Assign actions to an existing malware policy in a firewall policy.
  enable-override-http-header-logging                              Enable the HTTP Header Logging Override settings.
  enable-penalty-box                                               Enable penalty box in a policy.
  enable-rate-policy                                               Assigns an action to an existing rate policy in a policy.
  enable-reputation-profile                                        Enable and set the action for a reputation profile.
  enable-rule-action                                               Enable rule action in a policy.
  enable-slow-post                                                 Enable slow post in a policy.
  end-eval                                                         Stop evaluation in a policy.
  eval-hostnames                                                   List all hosts under evaluation.
  eval-penalty-box                                                 Display evaluation penalty box action in a policy.
  eval-penalty-box-conditions                                      Display evaluation penalty box conditions in a policy.
  eval-rule-action                                                 Display evaluation rule action in a policy.
  eval-rule-actions                                                Display evaluation rules and actions in a policy.
  eval-rule-condition-exception                                    Display evaluation rule conditions and exceptions in a policy.
  evasive-path-match                                               Display the Evasive Path Match settings.
  export                                                           Export a configuration version.
  failover-hostnames                                               List all failover hostnames on a config.
  hostname-coverage                                                Display the Hostname Coverage.
  http-header-logging                                              Display the HTTP Header Logging settings.
  ip-geo-firewall                                                  Display the IP Geo Firewall network lists in a policy
  javascript-injection-rules                                       Display contents of javascript injection rules.
  krs-rules-upgrade                                                Upgrade the KRS rules in a policy.
  malware-content-types                                            List all malware content types.
  malware-policies                                                 List all malware policies.
  malware-policies-actions                                         Display all enabled malware policy actions.
  malware-policy                                                   Display contents of a malware policy.
  match-target                                                     Read a match target.
  match-target-order                                               Change the match target sequence.
  match-targets                                                    List all match targets.
  mode                                                             Display the WAF Mode.
  modify-account-protection-transactional-endpoint                 Update a transactional endpoint for account protection.
  modify-account-protection-rule                                   Modify an account protection rule in a policy.
  modify-account-protection-rule-sequence                          Modify sequence of account protection rules.
  modify-account-protection-settings                               Modify account protection settings for a security policy.
  modify-account-protection-user-allow-list-id                     Modify user allow list id for account protection.
  modify-account-protection-user-risk-response-strategy            Modify account protected advanced settings for user risk response strategy.
  [Deprecated] modify-account-protection-transactional-endpoint-protection      Modify account protected advanced settings for transactional endpoints.
  modify-akamai-bot-category-action                                Update existing akamai bot category action.
  modify-api-match-target                                          Updates an API match target.
  modify-attackgroup-condition-exception                           Update attack group exceptions.    
  modify-bot-analytics-cookie                                      Update existing bot analytics cookie.
  modify-bot-detection-action                                      Update existing bot detection action.
  modify-bot-management-settings                                   Update existing bot management settings.
  modify-bot-protection-exceptions                                 Update existing bot protection exceptions.
  modify-bypass-network-lists                                      Update bypass network lists.
  modify-challenge-action                                          Update existing challenge action.
  modify-challenge-injection-rules                                 Update existing challenge injection rules.
  modify-client-side-security                                      Update existing client side security.
  modify-conditional-action                                        Update existing conditional action.
  modify-content-protection-rule                                   Update content protection rule.
  modify-content-protection-javascript-injection-rule              Update a content protection JavaScript injection rule.
  modify-content-protection-rule-detection-settings                Update detection settings of content protection rule.
  modify-content-protection-rule-sequence                          Update existing content protection rule sequence.
  modify-custom-bot-category                                       Update existing custom bot category.
  modify-custom-bot-category-action                                Update existing custom bot category action.
  modify-custom-bot-category-sequence                              Update existing custom bot category sequence.
  modify-custom-bot-category-item-sequence                         Update existing custom bot category item sequence.
  modify-custom-client                                             Update existing custom client.
  modify-custom-client-sequence                                    Update existing custom client sequence.
  modify-custom-defined-bot                                        Update existing custom defined bot.
  modify-custom-deny                                               Update existing custom deny action.
  modify-custom-deny-action                                        Update existing custom deny action.
  modify-custom-rule                                               Update existing custom rule.
  modify-eval-hostnames                                            Modify hostnames under evaluation.
  modify-eval-penalty-box-conditions                               Modify evaluation penalty box conditions in a policy.
  modify-eval-rule-condition-exception                             Update evaluation rule conditions and exceptions in a policy.
  modify-google-recaptcha-secret-key                               Update existing google recaptcha secret key.
  modify-hostnames                                                 Modify hostnames for the configuration version.
  modify-ip-geo-firewall                                           Update the IP Geo Firewall network lists in a policy
  modify-javascript-injection-rules                                Update existing javascript injection rules.
  modify-malware-policy                                            Modify an existing malware policy.
  modify-match-target                                              Updates a website match target.
  modify-penalty-box-conditions                                    Modify penalty box conditions in a policy.
  modify-pragma-header                                             Update Pragma Header settings.
  modify-prefetch-requests                                         Update the Prefetch Requests settings.
  modify-rate-policy                                               Update existing rate policy.
  modify-recategorized-akamai-defined-bot                          Update existing recategorized akamai defined bot.
  modify-reputation-profile                                        Update existing reputation profile.
  modify-rule-condition-exception                                  Update rule conditions and exceptions in a policy.
  modify-security-policy                                           Update a security policy.
  modify-serve-alternate-action                                    Update existing serve alternate action.
  modify-siem                                                      Modify the SIEM settings.
  modify-transactional-endpoint                                    Update existing transactional endpoint.
  modify-transactional-endpoint-protection                         Update existing transactional endpoint protection.
  modify-version-notes                                             Update the version notes.
  penalty-box                                                      Display penalty box action in a policy.
  penalty-box-conditions                                           Display penalty box conditions in a policy.
  policies                                                         List all security policies.
  pragma-header                                                    Display Pragma Header settings.
  prefetch-requests                                                Display the Prefetch Requests settings.
  protect-eval-hostnames                                           Move evaluation hostnames to protection.
  protections                                                      List all protections of a policy.
  rate-policies                                                    List all rate policies.
  rate-policies-actions                                            List all enabled rate policies actions of a policy.
  rate-policy                                                      Display contents of a rate policy.
  recategorized-akamai-defined-bot                                 Display contents of recategorized akamai defined bot.
  recategorized-akamai-defined-bot-list                            List all recategorized akamai defined bot.
  recommendations                                                  Display recommendations in a policy.
  reputation-profile                                               Display contents of a reputation profile.
  reputation-profile-action                                        Display the current reputation profile action.
  reputation-profile-actions                                       List all reputation profile actions.
  reputation-profile-analysis                                      Display the current reputation profile analysis settings.
  reputation-profiles                                              List all reputation profiles.
  reset-recommendation                                             Reset a recommendation.
  response-actions-list                                            List all response actions.
  restart-eval                                                     Restart evaluation in a policy.
  rotate-bot-analytics-cookie-values                               Rotate bot analytics cookie values.
  rule-action                                                      Display rule action in a policy.
  rule-actions                                                     List all rule actions in a policy.
  rule-condition-exception                                         Display rule conditions and exceptions in a policy.
  security-policy                                                  Display contents of security policy.  
  selectable-hostnames                                             List all selectable hostnames.
  selected-hostnames                                               List all currently chosen hostnames.
  serve-alternate-action                                           Display contents of serve alternate action.
  serve-alternate-action-list                                      List all serve alternate action.
  set-mode                                                         Set the WAF Mode.
  set-protections                                                  Update protections of a policy.
  set-reputation-profile-analysis                                  Set the reputation profile analysis settings.
  siem                                                             Display the SIEM settings.
  siem-definitions                                                 List all siem definitions.
  slow-post                                                        Display contents of slow post in a policy.
  start-eval                                                       Start evaluation in a policy.
  structured-rule-template                                         Prints sample JSON of a structured custom rule.                     [aliases: srt]
  transactional-endpoint                                           Display contents of transactional endpoint.
  transactional-endpoint-list                                      List all transactional endpoint.
  transactional-endpoint-protection                                Display contents of transactional endpoint protection.
  update-eval                                                      Update evaluation in a policy.
  upgrade-details                                                  Display rules updates.
  version                                                          Read a config version.
  version-notes                                                    Display the version notes.
  versions                                                         List all config versions.

Command options:
  --json        Print the raw json response. All commands respect this option.                       [boolean]
  --edgerc      The full path to the .edgerc file.                                                    [string]
  --section     The section of .edgerc to use.                                                        [string]
  --help        Prints help information.                                            [commands: help] [boolean]
  --version     Current version of the program.                                                      [boolean]
  --account-key Account ID to switch to when performing the operation                                 [string]
Copyright (C) Akamai Technologies, Inc
Visit http://github.com/akamai/cli-appsec for detailed documentation
```

#### Command details
For details about any individual command including arguments, options, and command options, you can run -
```
akamai appsec <command> --help
```

## akamai-appsec
This script wraps all of the functionality from the library into a command line utility which can be used to support the following use cases.

* [Protect a new host](#Protect-hosts)
* [Add/Update a custom rule](#custom-rule)

## Protect Hosts
Akamai customers can currently configure delivery of a new web property using the PAPI API/CLI. This use case enables protecting these new web properties. This protection is limited to adding the host to an existing security policy. The typical steps are listed in the following table:

|#|Commands|Comments|
|-|---------|--------|
|1|[akamai property create](https://github.com/akamai/cli-property#create)||
|2|[akamai property activate](https://github.com/akamai/cli-property#activate)||
|3|`akamai appsec configs`||
|4|`akamai appsec versions --config=<config id>`||
|5|`akamai appsec clone --config=<config id>`|Optional. You can skip this step if you choose to use an existing editable<sup>[1](#references)</sup> configuration version|
|6|`akamai appsec selectable-hostnames`  ||
|7|`akamai appsec modify-hostnames @input.json --append`||
|8a|`akamai appsec policies --config=<config id> --version=<version number>`||
|8b|`akamai appsec create-match-target --hostnames=<comma separated hostnames> --paths=<comma separated paths> --policy=<security policy id>`||
|8c|`akamai appsec match-target-order --insert=<match target id> --config=<config id> --version=<version number>`  ||
|8d|`akamai appsec modify-match-target <match target id> add-hostname <hostname>`||
|9|`akamai appsec activate --network=<activation network> --notes=<activation notes> --notify=<emails>`||
|10|`akamai appsec activation --activation-id=<activation id>`||

## Custom Rule
Adding or updating a custom rule to the protection of a hostname requires a change to a policy.  The custom rule action API is used to enable the custom rule.

|#|Commands|Comments|
|-|---------|--------|
|1|`akamai appsec clone --config=<config id>`|Optional. You can skip this step if you choose to use an existing editable<sup>[1](#references)</sup> configuration version|
|2|`akamai appsec structured-rule-template > structuredRule.json`|This prints a template json to the standard output. You must edit this template appropriately before creating the custom rule|
|3|`vim structuredRule.json`||
|4|`akamai appsec create-custom-rule @structuredRule.json`||
|5|`akamai appsec enable-custom-rule --custom-rule=<custom rule id> --policy=<security policy id> --action=<alert or deny>`||
|6|`akamai appsec activate --network=<activation network> --notes=<activation notes> --notify=<emails>`||
|7|`akamai appsec activation --activation-id=<activation id>`||

## Caveats
The Akamai CLI is a new tool and as such we have made some design choices worth mentioning.
* Credentials - the tool looks for credentials in the 'appsec' section in your ~/.edgerc file. If not present, it will look for the section 'default'. Alternatively you can provide the section name using the --section option in every command. If you are unfamiliar with the authentication and provisioning for OPEN APIs, see the "Get Started" section of https://developer.akamai.com

## References
<sup>1</sup>A configuration version is editable if it is not active currently or in the past in any of the environments(staging or production).
