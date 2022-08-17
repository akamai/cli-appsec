'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class AkamaiBotCategoryAction {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getAkamaiBotCategoryActionList() {
    return this._policy.readResource(URIs.AKAMAI_BOT_CATEGORY_ACTIONS, []);
  }

  getAkamaiBotCategoryAction() {
    return this._policy.readResource(URIs.AKAMAI_BOT_CATEGORY_ACTION, [
      this._options['category_id']
    ]);
  }

  updateAkamaiBotCategoryAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.AKAMAI_BOT_CATEGORY_ACTION,
        [this._options['category_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  akamaibotcategoryaction: AkamaiBotCategoryAction
};
