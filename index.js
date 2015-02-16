/**
 * Autor Eugene Demchenko <demchenkoev@gmail.com>
 * Created on 13.02.15.
 * License BSD
 */

(function() {

  var $ = {
    version: '0.0.1'
  };

  $.settings = {
  }
  
  $.errors = {
    'UNKNOWN_ERROR': 'Unknown error.'
  }

  $.defaultParser = function (args, next, cb, config) {
    var err
      , raw = args[0]
      , errors = config && config.errors ? config.errors : $.errors;
    switch (typeof raw) {
      case 'boolean':
        err = raw ? {code: 'UNKNOWN_ERROR'} : null;
        break;
      case 'number':
        err = {code: raw};
        break;
      case 'string':
        err = {code: errors.hasOwnProperty(raw) ? raw : 'UNKNOWN_ERROR'};
        break;
      case 'object':
        if (typeof raw === 'undefined' || raw === null) {
          err = null;
        } else {
          err = {code: typeof raw.code !== 'undefined' && errors.hasOwnProperty(raw.code) ? raw.code : 'UNKNOWN_ERROR'};
          err.message = raw.code === err.code ? (raw.message || errors[err.code]) : errors[err.code];
        }
        break;
      case 'symbol':
      case 'function':
      default:
        err = null;
    }

    if (err && typeof err.message === 'undefined') {
      err.message = errors.hasOwnProperty(err.code) ? errors[err.code] : '';
    }
    cb(err);
  }

  $.parsers = [];
  
  $.parse = function(args, cb, config)  {
    var i = 0, err = null;
    (function next() {
      if(i < $.parsers.length) {
        $.parsers[i++](args, next, cb, config);
        return;
      }
      $.defaultParser(args, null, cb, config);
    })();
  }

  //exports

  this.errorParser = $;

  if (typeof define === 'function' && define.amd) {
    define('errorParser', [], function() {
      return $;
    });
  }

}).call(this);
