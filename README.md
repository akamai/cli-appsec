**__This is a Beta Software__**
# Akamai CLI for Application Security

*NOTE:* This tool is intended to be installed via the Akamai CLI package manager, which can be retrieved from the releases page of the [Akamai CLI](https://github.com/akamai/cli) tool.

### Local Install, if you choose not to use the akamai package manager
* Node 7
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
  activate                                  Activate a version.
  activation                                Get activation status.
  clone                                     Clone a config.
  configs                                   List all available configurations.
  enable-custom-rule                        Assigns an action (such as alert or deny) to an existing custom rule in a policy.
  create-custom-rule                        Create a custom rule.
  delete-custom-rule                        Delete a custom rule.
  custom-rule                               Display contents of custom rule.
  modify-custom-rule                        Update existing custom rule.
  structured-rule-template                  Prints sample JSON of a structured custom rule.                     [aliases: srt]
  custom-rules                              List all custom rules.
  export                                    Export a configuration version.
  add-hostname                              Add hostnames to selected list.
  selectable-hostnames                      List all selectable hostnames.
  selected-hostnames                        List all currently chosen hostnames.
  create-match-target                       Creates a match target.
  modify-match-target                       Updates a match target.
  match-target-order                        Change the match target sequence.
  match-targets                             List all match targets.
  policies                                  List all security policies.
  clone-policy                              Clone security policy.
  version                                   Read a config version.
  versions                                  List all config versions.
  create-rate-policy                        (Beta) Create a rate policy.
  delete-rate-policy                        (Beta) Delete a rate policy.
  rate-policy                               (Beta) Display contents of a rate policy.
  modify-rate-policy                        (Beta) Update existing rate policy.
  rate-policies                             (Beta) List all rate policies.
  api-endpoints                             (Beta) List all api endpoints.
  mode                                      (Beta) Display the WAF Mode.
  set-mode                                  (Beta) Set the WAF Mode.
  protections                               (Beta) List all protections of a policy.
  set-protections                           (Beta) Update protections of a policy.
  rate-policies-actions                     (Beta) List all enabled rate policies actions of a policy.
  enable-rate-policy                        (Beta) Assigns an action to an existing rate policy in a policy.
  disable-rate-policy                       (Beta) Removes an action set to an existing rate policy in a policy.
  slow-post                                 (Beta) Display contents of slow post in a policy.
  enable-slow-post                          (Beta) Enable slow post in a policy.
  disable-slow-post                         (Beta) Disable slow post in a policy.
  penalty-box                               (Beta) Display penalty box action in a policy.
  disable-penalty-box                       (Beta) Disable penalty box in a policy.
  enable-penalty-box                        (Beta) Enable penalty box in a policy.
  attack-groups                             (Beta) List all attack group actions in a policy.
  attack-group                              (Beta) Display attack group action in a policy.
  enable-attack-group                       (Beta) Enable attack group in a policy.
  disable-attack-group                      (Beta) Disable attack group  in a policy.
  rule-actions                              (Beta) List all rule actions in a policy.
  rule-action                               (Beta) Display rule action in a policy.
  enable-rule-action                        (Beta) Enable rule action in a policy.
  disable-rule-action                       (Beta) Disable rule action in a policy.
  rule-condition-exception                  (Beta) Display rule conditions and exceptions in a policy.
  modify-rule-condition-exception           (Beta) Update rule conditions and exceptions in a policy.
  eval-rule-actions                         (Beta) Display evaluation rules and actions in a policy.
  eval-rule-action                          (Beta) Display evaluation rule action in a policy.
  enable-eval-rule-action                   (Beta) Enable evaluation rule action in a policy.
  disable-eval-rule-action                  (Beta) Disable evaluation rule action in a policy.
  eval-rule-condition-exception             (Beta) Display evaluation rule conditions and exceptions in a policy.
  modify-eval-rule-condition-exception      (Beta) Update evaluation rule conditions and exceptions in a policy.
  start-eval                                (Beta) Start evaluation in a policy.
  end-eval                                  (Beta) Stop evaluation in a policy.
  restart-eval                              (Beta) Restart evaluation in a policy.
  update-eval                               (Beta) Update evaluation in a policy.
  complete-eval                             (Beta) Complete evaluation in a policy.
  krs-rules-upgrade                         (Beta) Upgrade the KRS rules in a policy.
  upgrade-details                           (Beta) Display rules updates.
  ip-geo-firewall                           (Beta) Display the IP Geo Firewall network lists in a policy
  modify-ip-geo-firewall                    (Beta) Update the IP Geo Firewall network lists in a policy
  create-reputation-profile                 (Beta) Create a reputation profile.
  delete-reputation-profile                 (Beta) Delete a reputation profile.
  reputation-profile                        (Beta) Display contents of a reputation profile.
  modify-reputation-profile                 (Beta) Update existing reputation profile.
  reputation-profiles                       (Beta) List all reputation profiles.
  reputation-profile-actions                (Beta) List all reputation profile actions.
  reputation-profile-action                 (Beta) Display the current reputation profile action.
  enable-reputation-profile                 (Beta) Enable and set the action for a reputation profile.
  disable-reputation-profile                (Beta) Disable the action for a reputation profile.
  custom-deny-list                          (Beta) List all custom deny actions.
  custom-deny                               (Beta) Display contents of custom deny action. 
  delete-custom-deny                        (Beta) Delete a custom deny action.
  create-custom-deny                        (Beta) Create-custom-deny action.
  modify-custom-deny                        (Beta) Update existing custom deny action.
  reputation-profile-analysis               (Beta) Display the current reputation profile analysis settings.
  set-reputation-profile-analysis           (Beta) Set the reputation profile analysis settings.
  failover-hostnames                        (Beta) List all failover hostnames on a config.
  siem-definitions                          (Beta) List all siem definitions.
  siem                                      (Beta) Display the SIEM settings.
  modify-siem                               (Beta) Modify the SIEM settings.
  http-header-logging                       (Beta) Display the HTTP Header Logging settings.
  enable-http-header-logging                (Beta) Enable the HTTP Header Logging settings.
  disable-http-header-logging               (Beta) Disable the HTTP Header Logging settings.
  enable-override-http-header-logging       (Beta) Enable the HTTP Header Logging Override settings.
  disable-override-http-header-logging      (Beta) Disable the HTTP Header Logging Override settings.
  prefetch-requests                         (Beta) Display the Prefetch Requests settings.
  modify-prefetch-requests                  (Beta) Update the Prefetch Requests settings.
  create-config                             (Beta) Create a new security config.
  delete-config                             (Beta) Delete a security config.
  create-security-policy                    (Beta) Create a security policy.
  modify-security-policy                    (Beta) Update a security policy.
  delete-security-policy                    (Beta) Delete a security policy.
  security-policy                           (Beta) Display contents of security policy.  
  contracts-groups                          (Beta) List contracts and groups with KSD/WAP line items.
  api-request-constraints-action            (Beta) Display API Request Constraint action.
  enable-api-request-constraints            (Beta) Set the API Request Constraint action.
  disable-api-request-constraints           (Beta) Disable API Request Constraint.
  attackgroup-condition-exception           (Beta) Display attack group exceptions.
  modify-attackgroup-condition-exception    (Beta) Update attack group exceptions.    
  protect-eval-hostnames                    (Beta) Move evaluation hostnames to protection.
  eval-hostnames                            (Beta) List all hosts under evaluation.
  modify-eval-hostnames                     (Beta) Modify hostnames under evaluation.
  hostname-coverage                         (Beta) Display the Hostname Coverage.

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
|7|`akamai appsec add-hostname <comma separated hostnames>`||
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