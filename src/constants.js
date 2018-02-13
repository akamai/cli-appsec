function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

const LOG = require('pino')({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
    prettyPrint: true,
    name: "app-sec"
});
var logger = function (loggerName) {
     return LOG.child({name:loggerName});
};
var resources = {
    "GET_CONFIGS": '/appsec-configuration/v1/configs',
    "GET_CONFIG": '/appsec-configuration/v1/configs/%s',
    "GET_VERSIONS": '/appsec-configuration/v1/configs/%s/versions',
    "GET_VERSION": '/appsec-configuration/v1/configs/%s/versions/%s',
    "GET_CRB_ALL": '/appsec-resource/v1/configs/%s/custom-rules',
    "GET_CRB": '/appsec-resource/v1/configs/%s/custom-rules/%s',
    "SELECTED_HOSTS_RESOURCE": "/appsec-configuration/v1/configs/%s/versions/%s/selected-hostnames"
};

define("URIS", resources);
define("logger", logger);
