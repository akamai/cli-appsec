class CommandOutput {
  constructor() {}

  _out(object, options, customPrinter, objectType) {
    // store original response to be used in JSON output
    const originalResponse = object;
    // objectType is the map key of the object
    object = objectType ? object[objectType] : object;
    let filteredResponse = object;
    // convert the response into array for querying
    if (!(object instanceof Array)) {
      filteredResponse = [object];
    }
    // --query parsing
    if (options.query || options.q) {
      let query = options.query || options.q;
      // if query is in CSV
      let queries = query.split(',');
      queries = queries.map(query => query.split('='));
      // for each query term - each term will be "AND"
      queries.forEach(query => {
        const queryKey = query[0];
        const queryValue = query[1];
        filteredResponse = filteredResponse.filter(obj => {
          return this.search(obj[queryKey], queryValue);
        });
      });
    }
    // --sort parsing
    if (options.sort) {
      // sort can be have the order as "--sort key,desc"
      const sortParams = options.sort.split(',');
      const sort = sortParams[0];
      const order = sortParams[1];
      filteredResponse = filteredResponse.sort((a, b) => {
        if (order === 'desc' || order === 'descending') {
          if (this.getPropByString(a, sort) < this.getPropByString(b, sort)) {
            return 1;
          } else if (this.getPropByString(a, sort) > this.getPropByString(b, sort)) {
            return -1;
          }
          return 0;
        } else {
          if (this.getPropByString(a, sort) < this.getPropByString(b, sort)) {
            return -1;
          } else if (this.getPropByString(a, sort) > this.getPropByString(b, sort)) {
            return 1;
          }
          return 0;
        }
      });
    }
    // --json parsing
    if (options.json) {
      // response could be converted to array for querying, convert it back to object if was not an array originally
      if (!(object instanceof Array)) {
        filteredResponse = filteredResponse[0];
      }
      let jsonOutput = filteredResponse;
      // If the command have objectType, the JSON output should display the objectType
      if (objectType) {
        originalResponse[objectType] = filteredResponse;
        jsonOutput = originalResponse;
      }
      console.log(JSON.stringify(jsonOutput));
    } else {
      // --fields parsing
      if (options.fields || options.f) {
        let fields = options.fields || options.f;
        const displayedFields = fields.split(',');
        const output = [];
        // go thru filtered response and pick only the fields which are specified with --fields
        filteredResponse.forEach(row => {
          const outputRow = {};
          displayedFields.forEach(field => {
            // if fields contains nested property
            const prop = this.getPropByString(row, field);
            outputRow[field] = typeof prop === 'object' ? JSON.stringify(prop) : prop;
          });
          output.push(outputRow);
        });
        // --raw parsing
        if (options.raw) {
          let outputFieldsValue = [];
          displayedFields.forEach(outputField => {
            // --raw (currently) works if the filtered response returns 1 match only
            // TODO: Refactor this to support multiple records with --raw
            outputFieldsValue.push(output[0][outputField]);
          });
          // return response with --raw
          console.log(outputFieldsValue.join(','));
        } else {
          // otherwise return response in table format
          console.table(output);
        }
      } else {
        // response could be converted to array for querying, convert it back to object if was not an array originally
        if (!(object instanceof Array)) {
          filteredResponse = filteredResponse[0];
        }
        let jsonOutput = filteredResponse;
        // If the command have objectType, return the original response output should display the objectType
        if (objectType) {
          originalResponse[objectType] = filteredResponse;
          jsonOutput = originalResponse;
        }
        console.log(customPrinter(options, jsonOutput));
      }
    }
  }

  _errorOut(
    errJson,
    options,
    customPrinter = (opt, err) => {
      return typeof err == 'string' ? err : err.detail ? err.detail : err.title;
    }
  ) {
    if (options.json) {
      console.error(JSON.stringify(errJson));
    } else {
      console.error(customPrinter(options, errJson));
    }
    process.exit(1);
  }

  print(handlerOptions) {
    handlerOptions.promise
      .then(res => {
        this._out(res, handlerOptions.args, handlerOptions.success, handlerOptions.objectType);
      })
      .catch(err => {
        this._errorOut(err, handlerOptions.args, handlerOptions.error);
      });
  }

  // get nested property
  getPropByString(obj, propString) {
    if (!propString) return obj;
    let prop,
      props = propString.split('.');
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];
      let candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }

  // wildcard searching
  search(str, rule) {
    var escapeRegex = str => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    return new RegExp(
      '^' +
        rule
          .split('*')
          .map(escapeRegex)
          .join('.*') +
        '$'
    ).test(str);
  }
}

module.exports = new CommandOutput();
