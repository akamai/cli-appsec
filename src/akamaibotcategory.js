'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class AkamaiBotCategory {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  getAkamaiBotCategoryList() {
    return this._edge.get(URIs.AKAMAI_BOT_CATEGORYS, []);
  }

  getAkamaiBotCategory() {
    return this._edge.get(URIs.AKAMAI_BOT_CATEGORY, [this._options['category_id']]);
  }
}

module.exports = {
  akamaibotcategory: AkamaiBotCategory
};
