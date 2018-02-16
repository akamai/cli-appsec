/* global describe it after beforeEach*/
process.env.MOCK_AKA_SEC_API = 'false';
var chai = require('chai');
var expect = chai.expect;

var AppSecConfig = require('../src/configprovider').configProvider;
var Version = require('../src/versionsprovider').versionProvider;
var nock = require('nock');
const CONFIGS_URL = '/appsec-configuration/v1/configs';
const VERSIONS_URL = '/appsec-configuration/v1/configs/1234/versions';
const VERSION_URL = '/appsec-configuration/v1/configs/1234/versions/1';

describe('AppSecConfig get configurations', function() {
  var appSecConfig = new AppSecConfig(undefined, {});
  let result = [
    {
      configId: 1234
    },
    {
      configId: 5678
    }
  ];
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, result);
  });
  after(function() {
    nock.cleanAll();
  });
  it('success resp should return all configurations', function() {
    return appSecConfig.configs().then(configs => {
      expect(configs).to.deep.equal(result);
    });
  });
});

describe('AppSecConfig get configurations', function() {
  var appSecConfig = new AppSecConfig(undefined, {});
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .replyWithError({
        detail: 'Some Error'
      });
  });
  after(function() {
    nock.cleanAll();
  });
  it('connection problem should show error message', function() {
    let resultPromise = appSecConfig.configs({
      config: 1234
    });
    return resultPromise.catch(err => {
      expect(err).to.equal('Could not get data at this time.');
    });
  });
});

describe('AppSecConfig get configurations', function() {
  var appSecConfig = new AppSecConfig(undefined, {});
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(403, {
        detail: 'Unauthorized'
      });
  });
  after(function() {
    nock.cleanAll();
  });
  it('non-200 responses should show error message', function() {
    let resultPromise = appSecConfig.configs();
    return resultPromise.catch(err => {
      expect(err).to.deep.equal({
        detail: 'Unauthorized'
      });
    });
  });
});

describe('AppSecConfig get versions', function() {
  var appSecConfig = new Version(undefined, {});
  let result = [
    {
      configId: 1234
    },
    {
      configId: 5678
    }
  ];
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, result);
    nock(/.*.akamaiapis.net/)
      .get(VERSIONS_URL)
      .reply(200, result);
  });
  after(function() {
    nock.cleanAll();
  });
  it('throw error when there are more than one configs and user did not supply config id', function() {
    return appSecConfig.versions({}).catch(err => {
      expect(err).to.equal(
        'You have more than one configuration. Please provide a configuration id to work with.'
      );
    });
  });
});

describe('AppSecConfig get version', function() {
  let appSecConfig = new Version(undefined, {});
  let expectedStageVersion = 1;
  let expectedProdVersion = 2;
  let latestVersion = 2;
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, [
        {
          configId: 1234
        }
      ]);
    nock(/.*.akamaiapis.net/)
      .get(VERSIONS_URL)
      .reply(200, {
        configId: 17956,
        configName: 'jtigano.WAF.test',
        lastCreatedVersion: 4,
        links: [
          {
            href: '/appsec-configuration/v1/configs/17956/versions?page=1&pagesize=4',
            rel: 'self'
          }
        ],
        page: 1,
        pageSize: 4,
        productionActiveVersion: 2,
        stagingActiveVersion: 1,
        totalSize: 4,
        versionList: [
          {
            production: {
              status: 'Deactivated',
              time: 1493753405000
            },
            staging: {
              status: 'Active',
              time: 1493732705000
            },
            version: 1
          },
          {
            production: {
              status: 'Active',
              time: 1493753405000
            },
            staging: {
              status: 'Inactive'
            },
            version: 2
          }
        ]
      });
    nock(/.*.akamaiapis.net/)
      .get(VERSION_URL)
      .reply(200, { version: 1 });
  });
  after(function() {
    nock.cleanAll();
  });
  it('should return the latest version by default', function() {
    return appSecConfig.version({}).then(ver => {
      expect(ver.version).to.equal(latestVersion);
    });
  });

  let v1 = new Version(undefined, { version: 'PROD' });
  it('should return the production version when --version=PROD', function() {
    return v1.version().then(ver => {
      console.log(JSON.stringify(ver));
      expect(ver.version).to.equal(expectedProdVersion);
    });
  });

  let v2 = new Version(undefined, { version: 'PRODUCTION' });
  it('should return the production version when --version=PRODUCTION', function() {
    return v2.version().then(ver => {
      expect(ver.version).to.equal(expectedProdVersion);
    });
  });

  let v3 = new Version(undefined, { version: 'STAGING' });
  it('should return the staging version when --version=STAGING', function() {
    return v3.version().then(ver => {
      expect(ver.version).to.equal(expectedStageVersion);
    });
  });

  let v4 = new Version(undefined, { version: '1' });
  it('should return the proper version when --version is a number', function() {
    return v4.version().then(ver => {
      expect(ver.version).to.equal(expectedStageVersion);
    });
  });
});
