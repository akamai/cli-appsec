/* global describe it before*/
var chai = require('chai');
var expect = chai.expect;

var AppSecConfig = require("../appSecConfig").AppSecConfig;
var nock = require("nock");
const CONFIGS_URL='/appsec-configuration/v1/configs';

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  before(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .reply(200, [{ configId: 1234 },{ configId: 5678 }]);
  });

  it("success resp should return all configuration", function () {
    appSecConfig.configs().then(configs=>{
      expect(configs).to.deep.equal([1234,5678]);
    });
  });
});

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  before(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .replyWithError({detail:"Some Error"});
  });

  it("connection problem should show error message", function () {
    let resultPromise = appSecConfig.configs();
    resultPromise.catch(err=>{
      expect(err).to.equal("Could not get configurations at this time.");
    });
  });
});

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  before(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .reply(403, {detail:"Unauthorized"});
  });

  it("non-200 responses should show error message", function () {
    let resultPromise = appSecConfig.configs();
    resultPromise.catch(err=>{
      expect(err).to.equal("Unauthorized");
    });
  });
});
