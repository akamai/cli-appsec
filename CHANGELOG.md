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
