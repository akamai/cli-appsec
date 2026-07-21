# gen-appsec-cli

Generate CLI commands for an AppSec resource class, wire them into cli-appsec, smoke-test them, produce a reference doc, and ship a PR linked to a Jira ticket.

## Repo layout

| Repo | Purpose |
|---|---|
| `/Users/psathyes/githome/appsec-open` | OpenAPI server — Java resource classes, DTOs, internal API wiring |
| `/Users/psathyes/githome/cli-appsec` | CLI repo — commands, business logic, constants, templates, mock |

**Key paths inside cli-appsec:**
- `bin/commands/` — one `.js` file per command
- `src/` — business logic classes
- `src/constants.js` — all URI constants
- `templates/` — starter JSON payloads for PUT/POST commands
- `mock/` — mock responses for offline testing
- `docs/` — per-resource reference docs

**Key paths inside appsec-open:**
- `src/main/java/.../resource/` — JAX-RS resource classes (HTTP endpoints)
- `src/main/java/.../resource/dto/<resourcename>/` — DTOs (request/response shapes)
- `src/main/java/.../service/<Resource>Service.java` — service layer (internal HTTP calls)
- `src/main/java/.../service/Endpoint.java` — internal API path templates (enum)
- `src/main/java/.../service/EndpointProvider.java` — builds full internal URLs (reveals query params)
- `src/main/resources/descriptors/appsec/v1/*.raml` — RAML specs (may not exist for newer resources)

---

## Step 1 — Gather inputs

Ask the user for two things. Do not proceed until both are provided.

**1. Resource class name** — the Java class name (e.g. `AiRulesResource`) or RAML file name (e.g. `RatePolicies`). If the user is unsure, show both lists:

```bash
# RAML files (may not exist for all resources)
ls /Users/psathyes/githome/appsec-open/src/main/resources/descriptors/appsec/v1/*.raml \
  | xargs -I{} basename {} .raml | sort

# Java resource classes
ls /Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/resource/ \
  | grep -v dto | grep Resource | sed 's/Resource.java//' | sort
```

**2. Jira ticket ID** — e.g. `SECKSD-40580`. Once provided, fetch the ticket immediately:
```
mcp__akamai-tools__jira_get_issue(issue_key: "<TICKET>")
```
Read the summary and description to understand the scope (GET-only vs full CRUD, specific sub-resources, etc.). Scope the commands accordingly.

---

## Step 2 — Discover the API shape

### 2a. Try RAML first
```bash
cat /Users/psathyes/githome/appsec-open/src/main/resources/descriptors/appsec/v1/<ResourceName>.raml
```
If the file exists, extract paths, HTTP methods, URI params, query params, request/response schemas.

### 2b. If no RAML — read the Java resource class
```
/Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/resource/<ResourceName>Resource.java
```
Extract from annotations:
- `@Path(...)` — the external OpenAPI path (uses `security-policies/{policyId}`)
- `@GET`, `@PUT`, `@POST`, `@DELETE` per method — HTTP verbs
- `@PathParam` — URI parameters and their types (`long`, `Integer`, `String`)
- Request body parameter types (the DTO class name for PUT/POST)
- Return type (the DTO class name for responses)

### 2c. Read all DTOs
```
/Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/resource/dto/<resourcename>/
```
Read every file in this folder. For each DTO note all fields and their types — these become the request/response payloads.

### 2d. Read the Service class
```
/Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/service/<ResourceName>Service.java
```
Note which `EndpointProvider` method each operation calls (e.g. `EndpointProvider.aiRules()`).

### 2e. Read Endpoint enum + EndpointProvider for internal paths
```bash
grep -n "<ResourceName>\|<resourcename>" \
  /Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/service/Endpoint.java
```
This reveals the **internal** path template (uses `firewall-policies`, not `security-policies`).

Then find the matching method in `EndpointProvider.java`:
```bash
grep -n -A5 "<resourcename>\|<ResourceName>" \
  /Users/psathyes/githome/appsec-open/src/main/java/com/akamai/portal/appsec/open/service/EndpointProvider.java
```
This shows any query parameters appended (e.g. `?includeConditionExceptions=true`).

### 2f. Read any Mapper class
```bash
find /Users/psathyes/githome/appsec-open/src/main/java -name "<ResourceName>*Mapper.java" 2>/dev/null
```
If a mapper exists, read it. It documents field renames and dropped fields between the internal DTO and the external DTO returned to the CLI.

> **Key pattern**: internal paths use `firewall-policies/{policyId}`; external OpenAPI paths use `security-policies/{policyId}`. The CLI talks to the external path.

---

## Step 3 — Check what already exists

```bash
ls /Users/psathyes/githome/cli-appsec/bin/commands/ | grep -i <resourcename>
grep -i '<resourcename>' /Users/psathyes/githome/cli-appsec/src/constants.js
```

Also read a closely related existing command pair for reference patterns. Good choices:
- Policy-scoped resource → `bin/commands/evalrule.js` + `src/evalrules.js`
- Simple CRUD → `bin/commands/ratepolicy.js` + `src/ratepolicy.js`
- File input + modify → `bin/commands/accountprotectionrule.modify.js`

---

## Step 4 — Plan the commands

Based on what the Jira ticket scope says and the HTTP methods found in Step 2, plan which command files to create.

**Naming conventions:**

| Operation | Command file | `flags` value |
|---|---|---|
| GET collection | `<resource>.js` | `get-<resource>s` or `<resource>list` |
| GET by ID | `<resource>.js` | `get-<resource>` |
| POST create | `<resource>.create.js` | `create-<resource>` |
| PUT update | `<resource>.modify.js` | `modify-<resource>` |
| DELETE | `<resource>.delete.js` | `delete-<resource>` |
| GET sub-resource | `<resource><sub>.js` | `get-<resource>-<sub>` |
| PUT sub-resource | `<resource><sub>.modify.js` | `modify-<resource>-<sub>` |

Rules:
- File names: all lowercase, no hyphens (e.g. `airuleaction.modify.js`)
- `flags` values: kebab-case (e.g. `get-ai-rule-action`)
- Class names: PascalCase (e.g. `GetAiRuleActionCommand`)

**Provider selection** (based on path depth):

| Path contains | Provider to use | Import |
|---|---|---|
| `{configId}` only | Config provider | `require('./configprovider').configProvider` |
| `{configId}` + `{version}` | Version provider | `require('./versionsprovider').versionProvider` |
| `{configId}` + `{version}` + `{policyId}` | Version + Policy providers | both of the above |

For policy-scoped resources, always resolve `policyId` via `this._policyProvider.policyId().then(policyId => ...)`.

**Present the plan to the user and confirm before writing any files.**

---

## Step 5 — Add URI constants to `src/constants.js`

Insert new entries into the `resources` object. Insert them near related constants (e.g. near `EVAL_RULE_ACTIONS` for WAF-adjacent resources).

Format:
```javascript
// <ResourceName>
<RESOURCE_NAME>S: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/<resource-path>',
<RESOURCE_NAME>: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/<resource-path>/%s',
<RESOURCE_NAME>_STATUS: '/appsec/v1/configs/%s/versions/%s/security-policies/%s/<resource-path>/status',
```

Rules:
- Keys: SCREAMING_SNAKE_CASE
- One `%s` per URI parameter in order: `configId`, `versionId`, `policyId`, then resource IDs
- Use the **external** OpenAPI path (`security-policies`), not the internal `firewall-policies` path

After editing, check for syntax errors:
```bash
node -e "require('./src/constants')" && echo "OK"
```

---

## Step 6 — Create `src/<resourcename>.js`

Pattern for a **policy-scoped** resource (most common for security features):

```javascript
'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class <ResourceName> {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  // GET collection
  getAll<ResourceName>s() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.<RESOURCE_NAME>S, [policyId]);
    });
  }

  // GET by ID
  get<ResourceName>() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.<RESOURCE_NAME>, [policyId, this._options['<resource>-id']]);
    });
  }

  // GET sub-resource (no extra ID params)
  get<ResourceName>Status() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.<RESOURCE_NAME>_STATUS, [policyId]);
    });
  }

  // PUT with file input
  update<ResourceName>Status() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try { data = JSON.parse(payload); } catch (err) { throw 'The input JSON is not valid'; }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(URIs.<RESOURCE_NAME>_STATUS, [policyId], data);
      });
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }

  // DELETE
  delete<ResourceName>() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.deleteResource(URIs.<RESOURCE_NAME>, [policyId, this._options['<resource>-id']]);
    });
  }
}

module.exports = { <resourcename>: <ResourceName> };
```

Adjust methods to match the actual operations found in Step 2. For non-policy-scoped resources, remove `PolicyProvider` and use `this._version.*` directly.

**Provider method → URI param count mapping:**

| Method | URI `%s` count (after configId+versionId) |
|---|---|
| `readResource(URI, [])` | 0 extra (collection at version level) |
| `readResource(URI, [policyId])` | 1 extra (policy-level collection) |
| `readResource(URI, [policyId, resourceId])` | 2 extra |
| `updateResource(URI, [policyId], data)` | 1 extra |
| `updateResource(URI, [policyId, resourceId], data)` | 2 extra |
| `createResource(URI, [policyId], data)` | 1 extra (POST to collection) |
| `deleteResource(URI, [policyId, resourceId])` | 2 extra |

---

## Step 7 — Create `bin/commands/` files

One file per planned command. All follow this class structure:

```javascript
let <ClassName> = require('../../src/<resourcename>').<resourcename>;
let out = require('./lib/out');

class <CommandClassName> {
  constructor() {
    this.flags = '<kebab-case-command-name>';
    this.desc = '<One-line description>.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      // Required ID flags (for GET-by-ID, modify, delete):
      // .number('--<resource>-id <id>', { desc: '<Resource> ID.', group: 'Required:', required: true })
      // File input (for PUT/POST commands):
      // .positional('<@path>', { paramsDesc: 'The input file path.' })
      // Standard optional flags (always include these three for policy-scoped commands):
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc: "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      })
      .string('--policy <id>', {
        desc: 'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      });
      // File validation check (add when using positional <@path>):
      // .check((argv, context) => {
      //   if (!argv['@path'].startsWith('@')) {
      //     return context.cliMessage("ERROR: Invalid file name, should start with '@'");
      //   }
      // });
  }

  run(options) {
    // For file input commands, strip '@' prefix first:
    // options.file = options['@path'].replace('@', '');
    out.print({
      promise: new <ClassName>(options).<methodName>(),
      args: options,
      success: (args, data) => {
        return JSON.stringify(data);
      }
    });
  }
}

module.exports = new <CommandClassName>();
```

**Note on prettier**: the pre-commit hook runs `prettier` automatically on all `.js` files. Multi-line string args will be reformatted. This is expected — do not treat it as an error.

---

## Step 8 — Create JSON templates (PUT/POST commands only)

For each command that takes a `@<filepath>` input, create a starter template in `templates/`:

```
templates/<resourcename><subresource>.json
```

Populate it with the required fields from the request DTO (Step 2c), using sensible defaults. Example:
```json
{
  "fieldName": "defaultValue"
}
```

---

## Step 9 — Install dependencies and syntax check

First check if `node_modules` exists:
```bash
ls node_modules/.bin/eslint 2>/dev/null && echo "deps OK" || (echo "running npm install..." && npm install)
```

Then syntax-check all new files:
```bash
node -e "require('./src/constants')" && echo "constants OK"
node -e "require('./src/<resourcename>')" && echo "src OK"
# Repeat for each command file:
node -e "require('./bin/commands/<commandfile>')" && echo "<commandfile> OK"
```

Then lint:
```bash
./node_modules/.bin/eslint src/<resourcename>.js bin/commands/<resource>*.js
```

Fix any errors before continuing.

---

## Step 10 — Smoke test with mock API

The mock edgeClient strips `/appsec/v1/` from the URL and appends `.json`, resolving to files under `mock/`. Use the **existing** config and policy IDs from the mock data — do not invent new ones.

**Existing mock IDs:**
- Config ID: `1234`
- Version: `1`
- Policy IDs: `NN3_61`, `NN_2` (from `mock/configs/1234/versions/1/firewall-policies.json`)

**Mock file path formula:**
`/appsec/v1/configs/1234/versions/1/security-policies/NN3_61/<resource-path>` → `mock/configs/1234/versions/1/security-policies/NN3_61/<resource-path>.json`

For nested paths (e.g. `ai-rules/100/versions/1/action`), create the directory tree:
```bash
mkdir -p mock/configs/1234/versions/1/security-policies/NN3_61/<resource-path>/<id>/...
```

**Mock response file format** (required structure):
```json
{
  "responseToChoose": 0,
  "responses": [
    {
      "httpStatus": 200,
      "response": { /* actual response fields from the DTO */ }
    }
  ]
}
```

**Run smoke tests:**
```bash
# GET commands (no --policy needed if only one policy, but safest to include it)
MOCK_AKA_SEC_API=true node bin/akamai-appsec <get-command> --config 1234 --version 1 --policy NN3_61 --json 2>/dev/null

# PUT/POST commands (template files must exist)
MOCK_AKA_SEC_API=true node bin/akamai-appsec <modify-command> @templates/<template>.json --config 1234 --version 1 --policy NN3_61 --json 2>/dev/null

# Help text
node bin/akamai-appsec help <command-name> 2>/dev/null | grep -A20 "Usage:"
```

Verify:
- Valid JSON output when `--json` is passed
- No stack traces or uncaught exceptions
- Help shows `Required:` and `Optional:` sections correctly

Fix any failures before proceeding.

---

## Step 11 — Generate reference documentation

**11a. Update `README.md`** — add a section before `## Caveats`:

```markdown
## <Resource Name>

<One-line description of what this resource controls.>

| Command | Description |
|---------|-------------|
| `akamai appsec <cmd> [--config <id>] [--version <id>] [--policy <id>]` | Description |
| `akamai appsec <cmd> @<filepath> [...]` | Description |
```

**11b. Create `docs/<resourcename>-commands.md`** — full reference file covering:

1. **Base paths table** — external OpenAPI path vs internal Pulsar path side by side
2. **One section per command** with:
   - CLI syntax
   - Internal API URL (from `Endpoint.java` + `EndpointProvider.java`)
   - External OpenAPI URL (from the Java resource class `@Path`)
   - Request payload (JSON example from DTO fields, or "none")
   - Response payload (JSON example from DTO fields)
   - Template file path (for PUT/POST)
3. **Data flow diagram** — CLI → src → versionsprovider/policy → OpenAPI → Service → internal Pulsar API
4. **Mapping notes table** — if a Mapper class exists, document field renames and dropped fields
5. **Source files table** — command files, src file, constants, templates
6. **Jira link**

---

## Step 12 — Create the branch

Do not `git pull` if there are unstaged changes — create the branch directly from the current working state:

```bash
git checkout -b feature/<JIRA-TICKET>-<resourcename>-commands
```

If `develop` is behind remote and the working tree is clean, pull first:
```bash
git checkout develop && git pull origin develop
git checkout -b feature/<JIRA-TICKET>-<resourcename>-commands
```

---

## Step 13 — Stage and commit

Stage **only** the files created or modified for this resource. Be explicit — do not use `git add .` or `git add -A`.

```bash
git add \
  src/<resourcename>.js \
  src/constants.js \
  bin/commands/<resource>*.js \
  templates/<resource>*.json \
  mock/configs/1234/versions/1/security-policies/NN3_61/<resource-path>*.json \
  "mock/configs/1234/versions/1/security-policies/NN3_61/<resource-path>/<id>/..." \
  docs/<resourcename>-commands.md \
  README.md
```

Do **not** stage: `package-lock.json`, `readClaude.md`, `.claude/`, or any other pre-existing unstaged files.

Verify staged files:
```bash
git status --short
```

Commit:
```bash
git commit -m "<JIRA-TICKET> add CLI commands for <ResourceName>"
```

The pre-commit hook will run `prettier` on `.js` files automatically — this is expected and not an error.

---

## Step 14 — Push the branch

```bash
git push -u origin feature/<JIRA-TICKET>-<resourcename>-commands
```

The remote is `ssh://git@git.source.akamai.com:7999/ksd/cli-appsec.git`. If the push fails with "Insufficient permissions", the SSH key may not be loaded or configured. Ask the user to run:
```
! ssh-add -l
! git push -u origin feature/<JIRA-TICKET>-<resourcename>-commands
```
Wait for the user to confirm the push succeeded before creating the PR.

---

## Step 15 — Create the Bitbucket PR

Use `mcp__akamai-tools__bitbucket_create_pr`:

- **Title**: `<JIRA-TICKET> Add CLI commands for <ResourceName>`
- **Source branch**: `feature/<JIRA-TICKET>-<resourcename>-commands`
- **Target branch**: `develop`
- **Description**:
  ```
  ## Summary
  - Add CLI commands for <ResourceName> (SECKSD-XXXXX)
  - Commands: <list each `flags` value>

  ## Jira
  [<JIRA-TICKET>](https://track.akamai.com/jira/browse/<JIRA-TICKET>)

  ## Test plan
  - [ ] Smoke tested all commands with MOCK_AKA_SEC_API=true
  - [ ] All commands return valid JSON with --json flag
  - [ ] Help text renders Required/Optional sections correctly
  - [ ] ESLint passes with zero errors
  ```

Capture the PR URL from the response.

---

## Step 16 — Update the Jira ticket

Use `mcp__akamai-tools__jira_add_comment`:
```
PR raised for <ResourceName> CLI commands: <PR URL>

Commands added:
- <command-flag>: <one-line description>
- ...

Branch: feature/<JIRA-TICKET>-<resourcename>-commands
```

---

## Step 17 — Notify the team

Use `mcp__akamai-tools__bitbucket_add_pr_comment` on the new PR:
```
CLI commands for <ResourceName> are ready for review.

Commands added: <list>
Jira: <JIRA-TICKET> — <ticket summary>
Docs: docs/<resourcename>-commands.md

Please review for:
- Naming consistency with existing commands
- Flag naming conventions (kebab-case, --policy for policy-scoped)
- Output formatting matches --json / --fields expectations
```

Return the PR URL and Jira link to the user as the final output.

---

## Quick reference

### Standard optional flag descriptions (copy exactly)

```javascript
.number('--config <id>', {
  desc: 'Configuration ID. Mandatory if you have more than one configuration.',
  group: 'Optional:',
  required: false
})
.string('--version <id>', {
  desc: "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
  group: 'Optional:',
  required: false
})
.string('--policy <id>', {
  desc: 'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
  group: 'Optional:',
  required: false
})
```

### Module export / import convention

```javascript
// src/<resourcename>.js
module.exports = { <camelCaseName>: <ClassName> };

// bin/commands/<resource>.js
let <ClassName> = require('../../src/<resourcename>').<camelCaseName>;
```

### Mock test config/policy IDs

| Key | Value |
|---|---|
| Config ID | `1234` |
| Version | `1` |
| Policy ID | `NN3_61` (or `NN_2`) |
| Mock base path | `mock/configs/1234/versions/1/security-policies/NN3_61/` |
