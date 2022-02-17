## 2.6.0 (February Release)
- New Command:
  - `activation-history` command lists activation history for the configuration
## 2.5.0 (January Release)
- New Command:
  - `evasive-path-match` command displays the evasive path match settings
  - `enable-evasive-path-match` command enables evasive path match settings
  - `disable-evasive-path-match` command disable evasive path match settings

## 2.4.0 (August Release)
- New Command:
  - `recommendations` command displays recommendations in a policy
  - `accept-recommendation` command accepts a recommendation
  - `decline-recommendation` command declines a recommendation
  - `reset-recommendation` command resets a recommendation
- Renaming `start-eval` command parameter - `mode` to `eval-mode`

## 2.3.0 (July Release)

- WAP Plus support for selected-hostnames, modify-hostnames, and network-lists
- Added "mode" parameter to support ASE (Auto and Manual) for the "start-eval" command
- Added "threat-intel", "enable-threat-intel", and "disable-threat-intel" commands
- Support for including hostnames ("--include-hostnames") and contract-group ("--include-contract-group") in the "configs" command

## 2.2.0 (May Release)

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

## 2.1.0

- Commands:
  - Pragma header (list and modify)
  - Remove hosts for the match-targets

## 2.0.0

- Fixing security vulnerabilities
- Support for host and TLS fingerprint match conditions for the custom rules

## 1.9.0

- BETA Commands
