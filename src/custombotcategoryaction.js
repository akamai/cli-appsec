'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class CustomBotCategoryAction {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getCustomBotCategoryActionList() {
    return this._policy.readResource(URIs.CUSTOM_BOT_CATEGORY_ACTIONS, []);
  }

  getCustomBotCategoryAction() {
    return this._policy.readResource(URIs.CUSTOM_BOT_CATEGORY_ACTION, [
      this._options['category_id']
    ]);
  }

  updateCustomBotCategoryAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.CUSTOM_BOT_CATEGORY_ACTION,
        [this._options['category_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  custombotcategoryaction: CustomBotCategoryAction
};
