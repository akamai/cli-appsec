class CommandOutput {
  constructor() {}

  _out(object, options, customPrinter) {
    if (options.json) {
      console.log(JSON.stringify(object));
    } else {
      console.log(customPrinter(options, object));
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
        this._out(res, handlerOptions.args, handlerOptions.success);
      })
      .catch(err => {
        this._errorOut(err, handlerOptions.args, handlerOptions.error);
      });
  }
}

module.exports = new CommandOutput();
