/* global describe it after beforeEach*/
process.env.MOCK_AKA_SEC_API = 'false';
var chai = require('chai');
var expect = chai.expect;

var AppSecConfig = require("../src/appSecConfig").AppSecConfig;
var nock = require("nock");
const CONFIGS_URL = '/appsec-configuration/v1/configs';
const VERSIONS_URL = '/appsec-configuration/v1/configs/1234/versions';
const VERSION_URL = '/appsec-configuration/v1/configs/1234/versions/1';

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  let result = [{
    configId: 1234
  }, {
    configId: 5678
  }];
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, result);
  });
  after(function () {
    nock.cleanAll();
  });
  it("success resp should return all configurations", function () {
    return appSecConfig.configs().then(configs => {
      expect(configs).to.deep.equal(result);
    });
  });
});

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .replyWithError({
        detail: "Some Error"
      });
  });
  after(function () {
    nock.cleanAll();
  });
  it("connection problem should show error message", function () {
    let resultPromise = appSecConfig.configs({
      config: 1234
    });
    return resultPromise.catch(err => {
      expect(err).to.equal("Could not get data at this time.");
    });
  });
});

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(403, {
        detail: "Unauthorized"
      });
  });
  after(function () {
    nock.cleanAll();
  });
  it("non-200 responses should show error message", function () {
    let resultPromise = appSecConfig.configs();
    return resultPromise.catch(err => {
      expect(err).to.deep.equal({
        detail: "Unauthorized"
      });
    });
  });
});

describe("AppSecConfig get versions", function () {
  var appSecConfig = new AppSecConfig();
  let result = [{
    configId: 1234
  }, {
    configId: 5678
  }];
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, result);
    nock(/.*.akamaiapis.net/)
      .get(VERSIONS_URL)
      .reply(200, result);
  });
  after(function () {
    nock.cleanAll();
  });
  it("throw error when there are more than one configs and user did not supply config id", function () {
    return appSecConfig.versions({}).catch(err => {
      expect(err).to.equal('You have more than one configuration. Please provide a configuration id to work with.');
    });
  });
});

describe("AppSecConfig get version", function () {
  var appSecConfig = new AppSecConfig();
  let expectedStageVersion = 1;
  let expectedProdVersion = 2;
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, [{
        configId: 1234
      }]);
    nock(/.*.akamaiapis.net/)
      .get(VERSIONS_URL)
      .reply(200, {
        "configId": 17956,
        "configName": "jtigano.WAF.test",
        "lastCreatedVersion": 4,
        "links": [{
          "href": "/appsec-configuration/v1/configs/17956/versions?page=1&pagesize=4",
          "rel": "self"
        }],
        "page": 1,
        "pageSize": 4,
        "productionActiveVersion": 2,
        "stagingActiveVersion": 1,
        "totalSize": 4,
        "versionList": [{
            "production": {
              "status": "Deactivated",
              "time": 1493753405000
            },
            "staging": {
              "status": "Active",
              "time": 1493732705000
            },
            "version": 1
          },
          {
            "production": {
              "status": "Active",
              "time": 1493753405000
            },
            "staging": {
              "status": "Inactive"
            },
            "version": 2
          }
        ]
      });
    nock(/.*.akamaiapis.net/)
      .get(VERSION_URL)
      .reply(200, {version:1});
  });
  after(function () {
    nock.cleanAll();
  });
  it("should return the production version by default", function () {
    return appSecConfig.version({}).then(ver => {
      expect(ver.version).to.equal(expectedProdVersion);
    });
  });
  it("should return the production version when --version-id=PROD", function () {
    return appSecConfig.version({"version-id":"PROD"}).then(ver => {
      expect(ver.version).to.equal(expectedProdVersion);
    });
  });
  it("should return the production version when --version-id=PRODUCTION", function () {
    return appSecConfig.version({"version-id":"PRODUCTION"}).then(ver => {
      expect(ver.version).to.equal(expectedProdVersion);
    });
  });
  it("should return the staging version when --version-id=STAGING", function () {
    return appSecConfig.version({"version-id":"STAGING"}).then(ver => {
      expect(ver.version).to.equal(expectedStageVersion);
    });
  });
  it("should return the proper version when --version-id is a number", function () {
    return appSecConfig.version({"version-id":"1"}).then(ver => {
      expect(ver.version).to.equal(expectedStageVersion);
    });
  });
});