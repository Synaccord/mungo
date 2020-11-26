'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _type = _interopRequireDefault(require("./type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function prettify(prim) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    // console.log(require('util').inspect(options, { depth: null }));
    var tab = options.tab || '';

    if (options.isArray) {// tab = tab.replace(/-/g, ' ') + '- ';
    }

    if (prim === null) {
      return tab + 'null'.grey.italic.bold;
    }

    if (typeof prim === 'undefined') {
      return tab + 'undefined'.magenta.italic;
    }

    if (typeof prim === 'string') {
      return tab + "\"".concat(prim, "\"").cyan;
    }

    if (typeof prim === 'number') {
      return tab + prim.toString().yellow;
    }

    if (typeof prim === 'function') {
      return tab + "[Function: ".concat(prim.name || 'lambda', "]").italic;
    }

    if (prim === true) {
      return tab + 'true'.bgGreen.white.bold;
    }

    if (prim === false) {
      return tab + 'false'.bgRed.white.bold;
    }

    if (Array.isArray(prim)) {
      if (!prim.length) {
        return tab + '[]'.bold.grey;
      }

      var reOptions = {};
      Object.assign(reOptions, options, {
        tab: tab + '',
        isArray: true
      });
      var lines = prim.map(function (prim) {
        return prettify(prim, reOptions).replace(/^(\s+)/, '$1 - ') + '\n';
      }).join('\n');
      return lines.split('\n').map(function (line) {
        if (!/^-/.test(line.trim())) {
          line = "   ".concat(line);
        }

        return line;
      }).join('\n');
    }

    if (_typeof(prim) === 'object') {
      if ('plugins' in options && 'objects' in options.plugins) {
        for (var _constructor in options.plugins.objects) {
          if (prim instanceof options.plugins.objects[_constructor].def) {
            return tab + options.plugins.objects[_constructor].output(prim, options);
          }
        }
      }

      if (!Object.keys(prim).length) {
        return tab + '{}'.bold.grey;
      }

      var _reOptions = {};
      Object.assign(_reOptions, options, {
        tab: tab + '  ',
        isArray: false
      });

      if (prim instanceof require('mongodb').ObjectID) {
        return '  ' + tab + 'ObjectId'.magenta.italic + " ".concat(prim.toString()).grey;
      }

      return Object.keys(prim).map(function (key, index) {
        return {
          index: index,
          key: key,
          parsed: prettify(prim[key], _reOptions)
        };
      }).map(function (f) {
        var str = '';

        if (f.index === 0) {
          if (prim.constructor !== Object) {
            str += tab + prim.constructor.name.bold.grey + '\n';
          }
        }

        str += tab;

        if (/^_/.test(f.key)) {
          str += f.key.grey;
        } else {
          str += f.key;
        }

        var padding = ':..'.grey;

        for (var i = 0; i < 10 - f.key.length; i++) {
          padding += '.'.grey;
        }

        var breakLine = false;

        if (prim[f.key] && _typeof(prim[f.key]) === 'object' && Object.keys(prim[f.key]).length) {
          breakLine = true;

          if (prim[f.key] instanceof require('mongodb').ObjectID) {
            return str + padding + 'ObjectId'.magenta.italic + " ".concat(prim[f.key].toString()).grey;
          }

          if (prim[f.key] instanceof require('./type')) {
            var ret = str + padding + 'Type'.magenta.italic + " ".concat(prim[f.key].getType().name).grey;

            if (prim[f.key].isSubdocument()) {
              ret += '\n' + prettify(prim[f.key].getSubdocument(), {
                tab: tab + '  '
              });
            } else if (prim[f.key].isArray()) {
              ret += (' of ' + prim[f.key].getArray().getType().name.italic).grey;

              if (prim[f.key].getArray().isSubdocument()) {
                ret += '\n' + prettify(prim[f.key].getArray().getSubdocument(), {
                  tab: tab + '  '
                });
              }
            }

            return ret;
          }
        }

        if (Array.isArray(prim[f.key]) && !prim[f.key].length) {
          breakLine = false;
        }

        if (breakLine) {
          str += '\n' + f.parsed;
        } else {
          str += padding + f.parsed.trimLeft();
        }

        return str;
      }).join('\n');
    }
  } catch (error) {
    var _tab = options.tab || '';

    if (error.message === 'Maximum call stack size exceeded') {
      return _tab + '[Circular]'.red.bold;
    }

    return _tab + '{could not prettify}'.red.bgYellow.bold + ' ' + error.message.bgRed;
  }
}

prettify.styles = {
  "null": {
    color: 'grey'
  }
};
var _default = prettify;
exports["default"] = _default;