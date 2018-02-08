require("string-format");
// var URIs = require("../constants").URIS;
var fs = require("fs");
// var logger = require('pino')({
//     level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
//     prettyPrint: true,
//     name: "AppSecConfig"
// });
const CRB_TEMPLATE_PATH=__dirname + '/../templates/crbTemplate.json';
const ENCODING='utf8';

class CRBHandler {
    template() {
        return new Promise((resolve) => {
            resolve(fs.readFileSync(CRB_TEMPLATE_PATH, ENCODING));
        });
    }
}
module.exports = {
    CRBHandler: CRBHandler
};
