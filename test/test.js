/* global describe it before after*/
process.env.MOCK_AKA_SEC_API = 'false';
var chai = require('chai');
var expect = chai.expect;

var AppSecConfig = require("../src/appSecConfig").AppSecConfig;
var nock = require("nock");
const CONFIGS_URL='/appsec-configuration/v1/configs';

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  let result = [{ configId: 1234 },{ configId: 5678 }];
  /* Mock the HTTPS call */
  before(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .reply(200, result);
  });
  after(function(){
    nock.cleanAll();
  });
  it("success resp should return all configuration ids only", function () {
    appSecConfig.configs({json:false}).then(configs=>{
      expect(configs).to.deep.equal('1234\n5678');
    });
  });
  it("success resp should return all configuration jsons", function () {
    appSecConfig.configs({json:true}).then(configs=>{
      expect(configs).to.deep.equal(result);
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
  after(function(){
    nock.cleanAll();
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
  after(function(){
    nock.cleanAll();
  });
  it("non-200 responses should show error message", function () {
    let resultPromise = appSecConfig.configs();
    resultPromise.catch(err=>{
      expect(err).to.equal("Unauthorized");
    });
  });
});
