# Client-Side Protection (CPC) CLI Commands

Jira: [SECKSD-42876](https://track.akamai.com/jira/browse/SECKSD-42876)

## Base paths

| Layer | Path |
|---|---|
| External OpenAPI | `/appsec/v1/configs/{configId}/versions/{version}/security-policies/{policyId}/client-side-protection` |
| Internal Pulsar (PAGE_INTEGRITY_API) | `/v1/configs/{configId}/versions/{version}/firewall-policies/{policyId}/client-side-protection` |

---

## Commands

### `get-cpc-config`

Display client-side protection configuration for a security policy.

**CLI syntax:**
```
akamai appsec get-cpc-config [--config <id>] [--version <id>] [--policy <id>]
```

**External OpenAPI URL (GET):**
```
GET /appsec/v1/configs/{configId}/versions/{versionNumber}/security-policies/{policyId}/client-side-protection
```

**Internal API URL:**
```
GET /v1/configs/{configId}/versions/{versionNumber}/firewall-policies/{policyId}/client-side-protection
```

**Request payload:** none

**Response payload:**
```json
{
  "edgeInjection": {
    "clientSideProtectionConfigId": 82164,
    "loadScriptAsync": false
  },
  "edgeTestParameters": {
    "disableInjectionKey": "client-side-protection",
    "disableInjectionValue": "disable-injection-1234_319669",
    "forceInjectionKey": "client-side-protection",
    "forceInjectionValue": "force-injection-1234_319669"
  },
  "injectionCriteria": {
    "injectionPathIncludes": "/payments /checkout/*",
    "injectionPathExcludes": "/login /settings/*",
    "injectionPercent": 21,
    "injectionPolicy": "first_script"
  }
}
```

---

### `modify-cpc-config`

Update client-side protection configuration for a security policy.

**CLI syntax:**
```
akamai appsec modify-cpc-config @<filepath> [--config <id>] [--version <id>] [--policy <id>]
```

**External OpenAPI URL (PUT):**
```
PUT /appsec/v1/configs/{configId}/versions/{versionNumber}/security-policies/{policyId}/client-side-protection
```

**Internal API URL:**
```
PUT /v1/configs/{configId}/versions/{versionNumber}/firewall-policies/{policyId}/client-side-protection
```

**Template file:** `templates/cpcconfig.json`

**Request payload:**
```json
{
  "edgeInjection": {
    "loadScriptAsync": false
  },
  "edgeTestParameters": {
    "disableInjectionKey": "client-side-protection",
    "disableInjectionValue": "disable-injection-1234_319669",
    "forceInjectionKey": "client-side-protection",
    "forceInjectionValue": "force-injection-1234_319669"
  },
  "injectionCriteria": {
    "injectionPathIncludes": "/payments /checkout/*",
    "injectionPathExcludes": "/login /settings/*",
    "injectionPercent": 100,
    "injectionPolicy": "first_script"
  }
}
```

**Response payload:** same shape as GET response (minus `clientSideProtectionConfigId`)

---

## Data flow

```
CLI → src/cpcconfig.js → versionsprovider + policy → OpenAPI (SecurityPolicyResource)
    → ClientSideProtectionServiceImpl → PAGE_INTEGRITY_API (internal Pulsar)
    → ClientSideProtectionMapper (response transform) → CLI output
```

## Mapper notes

`ClientSideProtectionMapper` bridges the flat internal response to the structured external DTO:

| Internal field | External field | Notes |
|---|---|---|
| `response.configId` | `edgeInjection.clientSideProtectionConfigId` | Read-only; not sent on PUT |
| `response.loadScriptAsync` | `edgeInjection.loadScriptAsync` | |
| `advancedSettings.injectionPathIncludes` (List) | `injectionCriteria.injectionPathIncludes` (String) | space-joined on GET, split on PUT |
| `advancedSettings.injectionPathExcludes` (List) | `injectionCriteria.injectionPathExcludes` (String) | space-joined on GET, split on PUT |
| `advancedSettings.disableInjectionKey` | `edgeTestParameters.disableInjectionKey` | |
| `advancedSettings.disableInjectionValue` | `edgeTestParameters.disableInjectionValue` | |
| `advancedSettings.forceInjectionKey` | `edgeTestParameters.forceInjectionKey` | |
| `advancedSettings.forceInjectionValue` | `edgeTestParameters.forceInjectionValue` | |
| `advancedSettings.scriptTagAttributes` | (dropped) | not exposed externally |

## Source files

| File | Purpose |
|---|---|
| `bin/commands/cpcconfig.js` | GET command |
| `bin/commands/cpcconfig.modify.js` | PUT command |
| `src/cpcconfig.js` | Business logic |
| `src/constants.js` | `CPC_CONFIG` URI constant |
| `templates/cpcconfig.json` | Starter PUT payload |
| `mock/configs/1234/versions/1/security-policies/NN3_61/client-side-protection.json` | Mock response |
