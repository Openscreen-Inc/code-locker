'use strict'
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, '__esModule', {value: true})
exports.Configstore = void 0
var path = require('path')
var dotProp = require('dot-prop')
var fs = require('graceful-fs')
var writeFileAtomic = require('write-file-atomic')
var permissionError = "You don't have access to this file."
var mkdirOptions = {mode: 448, recursive: true}
var writeFileOptions = {mode: 384}
var Configstore = /** @class */ (function () {
  function Configstore(id, defaults) {
    if (defaults === void 0) {
      defaults = {}
    }
    this._path = process.env.HOME + '/.' + id + '/config.json'
    if (defaults) {
      this.all = __assign(__assign({}, defaults), this.all)
    }
  }
  Object.defineProperty(Configstore.prototype, 'all', {
    get: function () {
      try {
        return JSON.parse(fs.readFileSync(this._path, 'utf8'))
      } catch (error) {
        // Create directory if it doesn't exist
        if (error.code === 'ENOENT') {
          return {}
        }
        // Improve the message of permission errors
        if (error.code === 'EACCES') {
          error.message = error.message + '\n' + permissionError + '\n'
        }
        // Empty the file if it encounters invalid JSON
        if (error.name === 'SyntaxError') {
          writeFileAtomic.sync(this._path, '', writeFileOptions)
          return {}
        }
        throw error
      }
    },
    set: function (value) {
      try {
        // Make sure the folder exists as it could have been deleted in the meantime
        fs.mkdirSync(path.dirname(this._path), mkdirOptions)
        writeFileAtomic.sync(this._path, JSON.stringify(value, undefined, '\t'), writeFileOptions)
      } catch (error) {
        // Improve the message of permission errors
        if (error.code === 'EACCES') {
          error.message = error.message + '\n' + permissionError + '\n'
        }
        throw error
      }
    },
    enumerable: false,
    configurable: true,
  })
  Object.defineProperty(Configstore.prototype, 'size', {
    get: function () {
      return Object.keys(this.all || {}).length
    },
    enumerable: false,
    configurable: true,
  })
  Configstore.prototype.getItem = function (key) {
    return dotProp.get(this.all, key)
  }
  Configstore.prototype.setItem = function (key, value) {
    var config = this.all
    if (arguments.length === 1) {
      for (var _i = 0, _a = Object.keys(key); _i < _a.length; _i++) {
        var k = _a[_i]
        dotProp.set(config, k, key[k])
      }
    } else {
      dotProp.set(config, key, value)
    }
    this.all = config
  }
  Configstore.prototype.hasItem = function (key) {
    return dotProp.has(this.all, key)
  }
  Configstore.prototype.removeItem = function (key) {
    var config = this.all
    dotProp.delete(config, key)
    this.all = config
  }
  Configstore.prototype.clear = function () {
    this.all = {}
  }
  Object.defineProperty(Configstore.prototype, 'path', {
    get: function () {
      return this._path
    },
    enumerable: false,
    configurable: true,
  })
  return Configstore
})()
exports.Configstore = Configstore
