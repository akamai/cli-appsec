/* global describe it after beforeEach*/
process.env.MOCK_AKA_SEC_API = 'false';
var chai = require('chai');
var expect = chai.expect;

var Policy = require('../src/policy').policy;
var nock = require('nock');

const FIREWALL_POLICIES = '/appsec-configuration/v1/configs/1234/versions/1/security-policies';
const PROD_VER_FIREWALL_POLICIES =
  '/appsec-configuration/v1/configs/1234/versions/2/security-policies';
const LATEST_VER_FIREWALL_POLICIES =
  '/appsec-configuration/v1/configs/1234/versions/3/security-policies';
const CONFIGS_URL = '/appsec-configuration/v1/configs';
const VERSIONS_URL = '/appsec-configuration/v1/configs/1234/versions';
const VERSION_URL = '/appsec-configuration/v1/configs/1234/versions/1';

describe('Get policies', function() {
  let result = {
    configId: 1234,
    version: 3,
    policies: [
      {
        policyId: 'CANN3_61',
        policyName: 'CANN FW 3',
        policySecurityControls: {
          applyApplicationLayerControls: true,
          applyNetworkLayerControls: true,
          applyRateControls: false,
          applyReputationControls: false,
          applyBotmanControls: true,
          applyApiConstraints: false,
          applyUserValidationControls: false,
          applySlowPostControls: false
        },
        hasRatePolicyWithApiKey: true
      },
      {
        policyId: 'CANN_2',
        policyName: 'CANN FW 1',
        policySecurityControls: {
          applyApplicationLayerControls: true,
          applyNetworkLayerControls: true,
          applyRateControls: false,
          applyReputationControls: false,
          applyBotmanControls: false,
          applyApiConstraints: false,
          applyUserValidationControls: true,
          applySlowPostControls: false
        },
        hasRatePolicyWithApiKey: false
      }
    ]
  };
  /* Mock the HTTPS call */
  beforeEach(function() {
    nock(/.*.akamaiapis.net/)
      .get(FIREWALL_POLICIES)
      .reply(200, result);

    nock(/.*.akamaiapis.net/)
      .get(CONFIGS_URL)
      .reply(200, [{ configId: 1234 }]);

    nock(/.*.akamaiapis.net/)
      .get(VERSIONS_URL)
      .reply(200, {
        configId: 1234,
        configName: 'jtigano.WAF.test',
        lastCreatedVersion: 4,
        links: [
          { href: '/appsec-configuration/v1/configs/17956/versions?page=1&pagesize=4', rel: 'self' }
        ],
        page: 1,
        pageSize: 4,
        productionActiveVersion: 2,
        stagingActiveVersion: 1,
        totalSize: 4,
        versionList: [
          {
            production: { status: 'Deactivated', time: 1493753405000 },
            staging: { status: 'Active', time: 1493732705000 },
            version: 1
          },
          {
            production: { status: 'Active', time: 1493753405000 },
            staging: { status: 'Inactive' },
            version: 2
          }
        ]
      });

    nock(/.*.akamaiapis.net/)
      .get(VERSION_URL)
      .reply(200, { version: 1 });

    nock(/.*.akamaiapis.net/)
      .get(PROD_VER_FIREWALL_POLICIES)
      .reply(200, result);

    nock(/.*.akamaiapis.net/)
      .get(LATEST_VER_FIREWALL_POLICIES)
      .reply(200, result);
  });
  after(function() {
    nock.cleanAll();
  });
  it('success resp should return all policies for the given version and config', function() {
    let policy = new Policy({ version: 1, config: 1234 });
    return policy.policies().then(policies => {
      expect(policies).to.deep.equal(result);
    });
  });

  it('success resp should return all policies for the given version without config', function() {
    let policy = new Policy({ version: 1 });
    return policy.policies().then(policies => {
      expect(policies).to.deep.equal(result);
    });
  });

  it('success resp should return all policies without version and without config', function() {
    let policy = new Policy({});
    return policy.policies().then(policies => {
      expect(policies).to.deep.equal(result);
    });
  });

  it('success resp should return all policies with version=PROD and without config', function() {
    let policy = new Policy({ version: 'PROD' });
    return policy.policies().then(policies => {
      expect(policies).to.deep.equal(result);
    });
  });

  it('success resp should return all policies with version=STAGING and without config', function() {
    let policy = new Policy({ version: 'STAGING' });
    return policy.policies().then(policies => {
      expect(policies).to.deep.equal(result);
    });
  });
});
