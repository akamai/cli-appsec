'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class CustomBotCategory {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getCustomBotCategoryList() {
    return this._version.readResource(URIs.CUSTOM_BOT_CATEGORYS, []);
  }

  addCustomBotCategory() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CUSTOM_BOT_CATEGORYS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getCustomBotCategory() {
    return this._version.readResource(URIs.CUSTOM_BOT_CATEGORY, [this._options['category_id']]);
  }

  updateCustomBotCategory() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CUSTOM_BOT_CATEGORY,
        [this._options['category_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteCustomBotCategory() {
    return this._version.deleteResource(URIs.CUSTOM_BOT_CATEGORY, [this._options['category_id']]);
  }
}

module.exports = {
  custombotcategory: CustomBotCategory
};
