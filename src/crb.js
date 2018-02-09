"use strict";

let Edge = process.env.MOCK_AKA_SEC_API == 'true' ? require("../mock/edgeClient") : require("./edgeClient");

let util = require('util');
let URIs = require("./constants").URIS;
let ConfigProvider = require('./configProvider').configProvider;
let logger = require("./constants").logger("AppSecConfig");

require("string-format");
var fs = require("fs");
const CRB_TEMPLATE_PATH=__dirname + '/../templates/crbTemplate.json';
const ENCODING='utf8';

class CRBHandler {

    constructor(auth) {
        this._edge = new Edge(auth);
        this._configProvider = new ConfigProvider(this._edge);
    }
    _getConfigId(configId) {
        if (!configId) {
            if (this.configs().length == 1) {
                configId = this.configs()[0].id;
            } else {
                throw "You have more than one configuration. Please provide a configuration id to work with.";
            }
        }
    }

    template() {
        return new Promise((resolve) => {
            resolve(fs.readFileSync(CRB_TEMPLATE_PATH, ENCODING));
        });
    }

    getAllRules(providedConfigId) {
        let configId = this._configProvider.getConfigId(providedConfigId);
        return new Promise((resolve, reject) => {
                let customRulesUrl  = util.format(URIs.GET_CRB_ALL, configId);
                logger.debug("Attempting to get all custom rules at: " + customRulesUrl);
            let request = {
                method: "GET",
                path: customRulesUrl,
                followRedirect: false
            };
            this._edge.get(request).then(response => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        });
    }
    getRule(providedConfigId, ruleId) {
        let configId = this._configProvider.getConfigId(providedConfigId);
        return new Promise((resolve, reject) => {
            let customRulesUrl  = util.format(URIs.GET_CRB, configId, ruleId);
            logger.debug("Attempting to get custom rule at : " + customRulesUrl);
            let request = {
                method: "GET",
                path: customRulesUrl,
                followRedirect: false
            };
            this._edge.get(request).then(response => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
module.exports = {
    CRBHandler: CRBHandler
};
