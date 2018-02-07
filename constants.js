function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

var resources = {
    "GET_CONFIGS": '/appsec-configuration/v1/configs',
    "GET_VERSIONS": 'appsec-configuration/v1/configs/{}/versions'
  };

define("URIS", resources);