/* global describe it before after beforeEach*/
process.env.MOCK_AKA_SEC_API = 'false';
var chai = require('chai');
var expect = chai.expect;

var AppSecConfig = require("../src/appSecConfig").AppSecConfig;
var nock = require("nock");
const CONFIGS_URL='/appsec-configuration/v1/configs';
const VERSIONS_URL='/appsec-configuration/v1/configs/1234/versions';

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  let result = [{ configId: 1234 },{ configId: 5678 }];
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .reply(200, result);
  });
  after(function(){
    nock.cleanAll();
  });
  it("success resp should return all configuration ids only", function () {
    return appSecConfig.configs({json:false}).then(configs=>{
      expect(configs).to.deep.equal('1234\n5678');
    });
  });
  it("success resp should return all configuration jsons", function () {
    return appSecConfig.configs({json:true}).then(configs=>{
      expect(configs).to.equal(JSON.stringify(result));
    });
  });
});

describe("AppSecConfig get versions", function () {
  var appSecConfig = new AppSecConfig();
  let result = [{ configId: 1234 },{ configId: 5678 }];
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .reply(200, result);
    nock(/.*.akamaiapis.net/)
                .get(VERSIONS_URL)
                .reply(200, result);
  });
  after(function(){
    nock.cleanAll();
  });
  it("throw error when there are more than one configs and user did not supply config id", function () {
    return appSecConfig.versions({json:false}).catch(err=>{
      expect(err).to.equal('You have more than one configuration. Please provide a configuration id to work with.');
    });
  });
});

describe("AppSecConfig get configurations", function () {
  var appSecConfig = new AppSecConfig();
  /* Mock the HTTPS call */
  beforeEach(function () {
    nock(/.*.akamaiapis.net/)
                .get(CONFIGS_URL)
                .replyWithError({detail:"Some Error"});
  });
  after(function(){
    nock.cleanAll();
  });
  it("connection problem should show error message", function () {
    let resultPromise = appSecConfig.configs({config:1234});
    return resultPromise.catch(err=>{
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
                .reply(403, {detail:"Unauthorized"});
  });
  after(function(){
    nock.cleanAll();
  });
  it("non-200 responses should show error message", function () {
    let resultPromise = appSecConfig.configs();
    return resultPromise.catch(err=>{
      expect(err).to.equal("Unauthorized");
    });
  });
});
