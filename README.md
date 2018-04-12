# Akamai CLI for Application Security

*NOTE:* This tool is intended to be installed via the Akamai CLI package manager, which can be retrieved from the releases page of the [Akamai CLI](https://github.com/akamai/cli) tool.

### Local Install, if you choose not to use the akamai package manager
* Node 7
* npm install after *every* update
* Ensure that the 'bin' subdirectory is in your path

### Assumed Defaults
* Version number - if not specified, the tool will assume the latest version is editable and try to execute the actions on the version. If the version is not editable<sup>1</sup>, you will get an error.
* Config ID - if not specified, the tool will make an assumption that the user has only one configuration and try to execute the action on the editable<sup>1</sup> version.
* Security policy id - if not provided in commands that required a security policy, the tool will assume that the editable<sup>1</sup> version has only one policy and try to use it. If the said version has more than one policy, an error will be thrown asking for the policy id.

If left to these assumptions, the commands will perform slower than when these options are provided explicitly.
### Credentials
In order to use this configuration, you need to:
* Set up your credential files as described in the [authorization](https://developer.akamai.com/introduction/Prov_Creds.html) and [credentials](https://developer.akamai.com/introduction/Conf_Client.html) sections of the getting started guide on developer.akamai.com.  
* When working through this process you need to give grants for the Application Security API.  The section in your configuration file should be called 'default' unless you would like to pass the section name in every command using the `--section` option.

## Overview
The akamai appsec Kit is a set of nodejs libraries that wraps Akamai's {OPEN} APIs to help simplify protection to the properties delivered by Akamai. This kit can be used [as a no-fuss command line utility](#akamai-appsec) to interact with the library.

```
$ akamai appsec
Usage: akamai appsec <command> [options]

Commands:
  configs                   List all available configurations.
  enable-custom-rule        Assigns an action (such as alert or deny) to an existing custom rule in a policy.
  create-custom-rule        Create a custom rule.
  delete-custom-rule        Delete a custom rule.
  custom-rule               Display contents of custom rule.
  modify-custom-rule        Update existing custom rule.
  structured-rule-template  Prints sample JSON of a structured custom rule.                     [aliases: srt]
  custom-rules              List all custom rules.
  add-hostname              Add hostnames to selected list
  selectable-hostnames      List all selectable hostnames.
  selected-hostnames        List all currently chosen hostnames.
  create-match-target       Creates a match target.
  modify-match-target       Updates a match target.
  match-target-order        Change the match target sequence.
  match-targets             List all match targets.
  policies                  List all security policies.
  version                   Read a config version
  versions                  List all config versions

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

Copyright (C) Akamai Technologies, Inc
Visit http://github.com/akamai/cli-appsec for detailed documentation
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
|5|Clone configuration version _(comming soon)_|Optional. You can skip this step if you choose to use an existing editable<sup>[1](#references)</sup> configuration version|
|6|`akamai appsec selectable-hostnames`  ||
|7|`akamai appsec add-hostname <comma separated hostnames>`||
|8a|`akamai appsec policies --config=<config id> --version=<version number>`||
|8b|`akamai appsec create-match-target --hostnames=<comma separated hostnames> --paths=<comma separated paths> --policy=<security policy id>`||
|8c|`akamai appsec match-target-order --insert=<match target id> --config=<config id> --version=<version number>`  ||
|8d|`akamai appsec modify-match-target <match target id> add-hostname <hostname>`||
|9|Activate the configuration version _(comming soon)_||
|10|Check activation status _(comming soon)_||

## Custom Rule
Adding or updating a custom rule to the protection of a hostname requires a change to a policy.  The custom rule action API is used to enable the custom rule.

|#|Commands|Comments|
|-|---------|--------|
|1|Clone configuration version _(comming soon)_|Optional. You can skip this step if you choose to use an existing editable<sup>[1](#references)</sup> configuration version|
|2|`akamai appsec structured-rule-template > structuredRule.json`|This prints a template json to the standard output. You must edit this template appropriately before creating the custom rule|
|3|`vim structuredRule.json`||
|4|`akamai appsec create-custom-rule @structuredRule.json`||
|5|`akamai appsec enable-custom-rule --custom-rule=<custom rule id> --policy=<security policy id> --action=<alert or deny>`||
|6|Activate the configuration version _(comming soon)_||
|7|Check activation status _(comming soon)_||

For details about individual commands, please look at [Commands](#commands)
### Commands
* [Retrieve available configurations](#list-configurations)
* [Retrieve available configuration versions](#list-configuration-versions)
* [Retrieve a configuration version](#retrieve-configuration-version)
* [Retrieve hostnames available for protection](#list-selectable-hostnames)
* [Retrieve hostnames that are protected](#list-selected-hostnames)
* [Add hostname(s) to protect](#add-hostnames)
* [Retrieve Security policies](#list-security-policies)
* [Create a Website Match target](#create-website-match-target)
* [Retrieve Website Match targets](#list-website-match-targets)
* [Modify a Website Match target](#modify-website-match-target)
* [Change Website Match target order](#change-website-match-target-order)
* [Custom rule template](#custom-rule-template)
* [Create custom rule](#create-custom-rule)
* [Delete custom rule](#delete-custom-rule)
* [Modify a custom rule](#modify-custom-rule)
* [Enable a custom rule](#enable-custom-rule)
* [Retrieve all custom rules](#list-custom-rules)
* [Retrieve a custom rule](#retrieve-custom-rule)
* [Delete a custom rule](#delete-custom-rule)

### List Configurations
```
Usage: akamai appsec configs [options]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file. Defaults to ~/.edgrrc                                 [string]
  --section  The section of .edgerc to use. Defaults to 'default'                                     [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```

### List Configuration versions
```
Usage: akamai appsec versions [options]

Options:
  --config <id>  Configuration id. Mandatory if you have more than one configuration.                       [number]
  --limit <num>  Specifies the number of most recent versions of the selected configuration to be fetched.  [number]
  --verbose      Provides more details about each version.                                                  [boolean]
                 
Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file. Defaults to ~/.edgrrc                                 [string]
  --section  The section of .edgerc to use. Defaults to 'default'                                     [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```

### Retrieve Configuration version
```
Usage: akamai appsec version [options]

Options:
  --config <id>    Configuration id number. If not provided, assumes there is only one configuration and
                   chooses it. If there's more, an error is thrown.
                   [number]

  --version <num>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                   not provided, latest version is assumed.
                   [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file. Defaults to ~/.edgrrc                                 [string]
  --section  The section of .edgerc to use. Defaults to 'default'                                     [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```

### List Selectable Hostnames
These are the hostnames that the user can choose from, to add to the configuration version for protection.

```
Usage: akamai appsec selectable-hostnames [options]

Options:
  --config <id>   Configuration id. Mandatory if you have more than one configuration.
                  [number]

  --version <id>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not
                  provided, latest version is assumed.
                  [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```

### List Selected hostnames
These are the hostnames that the user is already protecting as part of this configuration version.
```

Usage: akamai appsec selected-hostnames [options]

Options:
  --config <id>   Configuration id. Mandatory if you have more than one configuration.
                  [number]

  --version <id>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not
                  provided, latest version is assumed.
                  [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```

### Add hostnames
Adds a new hostname to the protected list(selected hostnames). The hostnames chosen here should be from the selectable hostnames list.

```
Usage: akamai appsec add-hostname <hostnames> [options]

Arguments:
  <hostnames>      The comma separated list of hostnames to add.
                   [required] [array:string]

Options:
  --config <id>    Configuration id. Mandatory if you have more than one configuration.
                   [number]

  --version <num>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                   not provided, latest version is assumed.
                   [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```

### List Security policies
Retrieves the list of security policies present in this configuration version.

```
Usage: akamai appsec policies [options]

Options:
  --config <id>   Configuration id. Mandatory if you have more than one configuration.
                  [number]

  --version <id>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not
                  provided, latest version is assumed.
                  [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```

### Create website match target

```
Usage: akamai appsec create-match-target [options]

Options:
  --config <id>                        Configuration id. Mandatory if you have more than one configuration.
                                       [number]

  --version <id>                       The version number. It can also take the values 'PROD' or 'PRODUCTION'
                                       or 'STAGING'. If not provided, latest version is assumed.
                                       [string]

  --hostnames <a.com, b.net, c.d.com>  Hostnames to add.
                                       [required] [array:string]

  --paths <x,y,z>                      The file paths
                                       [required] [array:string]

  --policy <id>                        The policy id to use. If not provided, we try to use the policy
                                       available on file(slow). If you have more than one policy, this option must
                                       be provided.
                                       [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```

### List website match targets

```
Usage: akamai appsec match-targets [options]

Options:
  --config <id>    Configuration id. Mandatory if you have more than one configuration.
                   [number]

  --version <num>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                   not provided, latest version is assumed.
                   [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```
### Modify website match target
Updates an existing match target. As of now, the only supported operation is to add a hostname to the existing match target.

```
Usage: akamai appsec modify-match-target <match-target> <subcommand> <hostname> [options]

Arguments:
  <match-target>  The match target id.                                                     [required] [string]
  <hostname>      The hostname to add to the match target.                                 [required] [string]

Sub Commands:
  <subcommand>  The subcommand. [add-hostname]                                             [required] [string]

Options:
  --config <id>    Configuration id. Mandatory if you have more than one configuration.
                   [number]

  --version <num>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                   not provided, latest version is assumed.
                   [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```
### Change website match target order
Updates the order of the website match targets

```
Usage: akamai appsec match-target-order [options]

Options:
  --config <id>    Configuration id number
                   [number]

  --version <num>  The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                   not provided, latest version is assumed.
                   [string]

  --insert <id>    Match target id to move to the start.
                   [number]

  --append <id>    Match target id to move to the end.
                   [number]

  [order]          The comma separated list of numeric match target ids in desired order.
                   [array:number]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```
### Custom rule template

The custom rule needs to be fed as as json and this command prints the json template for creating a custom rule. You must add the required details in the json and remove the rest before creating a custom rule.

```
Usage: akamai appsec structured-rule-template
```
### Create custom rule
```
Usage: akamai appsec create-custom-rule [options]

Options:
  --config <id>  Configuration id. Mandatory if you have more than one configuration.                 [number]
  --file <path>  File with JSON rules                                           [required] [file] [must exist]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]

```
### Modify custom rule
```
Usage: akamai appsec modify-custom-rule [options]

Options:
  --config <id>       Configuration id. Mandatory if you have more than one configuration.            [number]
  --custom-rule <id>  Rule ID.                                                             [required] [number]
  --file <path>       File with JSON rules                                                 [file] [must exist]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```
### Enable custom rule
```
Usage: akamai appsec enable-custom-rule [options]

Options:
  --custom-rule <id>  Rule ID.
                      [required] [number]

  --policy <id>       Policy ID.
                      [required] [string]

  --action <action>   Action to assign. If the action is "none", it is not associated with the policy
                      [required] [enum] [alert, deny, none]

  --config <id>       Configuration id. Mandatory if you have more than one configuration.
                      [number]

  --version <num>     The version number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If
                      not provided, latest version is assumed.
                      [string]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
  ```
### List custom rules
```
Usage: akamai appsec custom-rules [options]

Options:
  --config <id>  Configuration id. Mandatory if you have more than one configuration.                 [number]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```

### Retrieve custom rule
```
Usage: akamai appsec custom-rule [options]

Options:
  --config <id>       Configuration id. Mandatory if you have more than one configuration.            [number]
  --custom-rule <id>  Rule ID.                                                             [required] [number]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```

### Delete custom rule
```
Usage: akamai appsec delete-custom-rule [options]

Options:
  --config <id>       Configuration id. Mandatory if you have more than one configuration.            [number]
  --custom-rule <id>  Rule ID.                                                             [required] [number]

Command options:
  --json     Print the raw json response. All commands respect this option.                          [boolean]
  --edgerc   The full path to the .edgerc file.                                                       [string]
  --section  The section of .edgerc to use.                                                           [string]
  --help     Prints help information.                                               [commands: help] [boolean]
  --version  Current version of the program.                                                         [boolean]
```
## Caveats
The Akamai CLI is a new tool and as such we have made some design choices worth mentioning.
* Credentials - the tool expects your credentials to be stored under a 'default' section in your ~/.edgerc file. Alternatively you can provide the section name using the --section option in every command. If you are unfamiliar with the authentication and provisioning for OPEN APIs, see the "Get Started" section of https://developer.akamai.com

## References
<sup>1</sup>A configuration version is editable if it is not active currently or in the past in any of the environments(staging or production).