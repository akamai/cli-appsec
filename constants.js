function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

var logger = function (loggerName) {
    return require('pino')({
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
        prettyPrint: true,
        name: loggerName
    });
};

var resources = {
    "GET_CONFIGS": '/appsec-configuration/v1/configs',
    "GET_VERSIONS": '/appsec-configuration/v1/configs/%s/versions',
    "GET_CRB": '/appsec-resource/v1/configs/%s/custom-rules'
};

define("URIS", resources);
define("logger", logger);