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
const CRB='/appsec-resource/v1/configs/%s/custom-rules';
var resources = {
    "GET_CONFIGS": '/appsec-configuration/v1/configs',
    "GET_VERSIONS": '/appsec-configuration/v1/configs/%s/versions',
    "GET_VERSION": '/appsec-configuration/v1/configs/%s/versions/%s',
    "GET_CRB_ALL": CRB,
    "GET_CRB": CRB + '/%s'
};

define("URIS", resources);
define("logger", logger);
