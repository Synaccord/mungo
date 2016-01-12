'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
function prettify(prim) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  try {
    var _ret = (function () {
      // console.log(require('util').inspect(options, { depth: null }));

      var tab = options.tab || '';

      if (options.isArray) {
        // tab = tab.replace(/-/g, ' ') + '- ';
      }

      if (prim === null) {
        return {
          v: tab + 'null'.grey.italic.bold
        };
      }

      if (typeof prim === 'undefined') {
        return {
          v: tab + 'undefined'.magenta.italic
        };
      }

      if (typeof prim === 'string') {
        return {
          v: tab + ('"' + prim + '"').cyan
        };
      }

      if (typeof prim === 'number') {
        return {
          v: tab + prim.toString().yellow
        };
      }

      if (typeof prim === 'function') {
        return {
          v: tab + ('[Function: ' + (prim.name || 'lambda') + ']').italic
        };
      }

      if (prim === true) {
        return {
          v: tab + 'true'.bgGreen.white.bold
        };
      }

      if (prim === false) {
        return {
          v: tab + 'false'.bgRed.white.bold
        };
      }

      if (Array.isArray(prim)) {
        var _ret2 = (function () {
          if (!prim.length) {
            return {
              v: {
                v: tab + '[]'.bold.grey
              }
            };
          }

          var reOptions = {};

          _Object$assign(reOptions, options, {
            tab: tab + '',
            isArray: true
          });

          var lines = prim.map(function (prim) {
            return prettify(prim, reOptions).replace(/^(\s+)/, '$1 - ') + '\n';
          }).join('\n');

          return {
            v: {
              v: lines.split('\n').map(function (line) {
                if (!/^-/.test(line.trim())) {
                  line = '   ' + line;
                }
                return line;
              }).join('\n')
            }
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }

      if (typeof prim === 'object') {
        var _ret3 = (function () {

          if ('plugins' in options && 'objects' in options.plugins) {

            for (var _constructor in options.plugins.objects) {
              if (prim instanceof options.plugins.objects[_constructor].def) {

                return {
                  v: {
                    v: tab + options.plugins.objects[_constructor].output(prim, options)
                  }
                };
              }
            }
          }

          if (!_Object$keys(prim).length) {
            return {
              v: {
                v: tab + '{}'.bold.grey
              }
            };
          }

          var reOptions = {};

          _Object$assign(reOptions, options, {
            tab: tab + '  ',
            isArray: false
          });

          if (prim instanceof require('mongodb').ObjectID) {
            return {
              v: {
                v: '  ' + tab + 'ObjectId'.magenta.italic + (' ' + prim.toString()).grey
              }
            };
          }

          return {
            v: {
              v: _Object$keys(prim).map(function (key, index) {
                return { index: index, key: key, parsed: prettify(prim[key], reOptions) };
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

                if (prim[f.key] && typeof prim[f.key] === 'object' && _Object$keys(prim[f.key]).length) {
                  breakLine = true;

                  if (prim[f.key] instanceof require('mongodb').ObjectID) {
                    return str + padding + 'ObjectId'.magenta.italic + (' ' + prim[f.key].toString()).grey;
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
              }).join('\n')
            }
          };
        })();

        if (typeof _ret3 === 'object') return _ret3.v;
      }
    })();

    if (typeof _ret === 'object') return _ret.v;
  } catch (error) {
    var tab = options.tab || '';

    if (error.message === 'Maximum call stack size exceeded') {
      return tab + '[Circular]'.red.bold;
    }
    return tab + '{could not prettify}'.red.bgYellow.bold + ' ' + error.message.bgRed;
  }
}

prettify.styles = {
  'null': {
    color: 'grey'
  }
};

exports['default'] = prettify;
module.exports = exports['default'];