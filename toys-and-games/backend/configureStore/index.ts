const path = require('path');
const dotProp = require('dot-prop');
const fs = require('graceful-fs');
const writeFileAtomic = require('write-file-atomic');
import { IAuthStorage } from 'openscreen';

const permissionError = "You don't have access to this file.";
const mkdirOptions = { mode: 0o0700, recursive: true };
const writeFileOptions = { mode: 0o0600 };

export class Configstore implements IAuthStorage {
  _path: string;

  constructor(id: string, defaults: any = {}) {
    this._path = `${process.env.HOME}/.${id}/config.json`;
    if (defaults) {
      this.all = {
        ...defaults,
        ...this.all,
      };
    }
  }

  get all() {
    try {
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    } catch (error) {
      // Create directory if it doesn't exist
      if (error.code === 'ENOENT') {
        return {};
      }

      // Improve the message of permission errors
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      // Empty the file if it encounters invalid JSON
      if (error.name === 'SyntaxError') {
        writeFileAtomic.sync(this._path, '', writeFileOptions);
        return {};
      }

      throw error;
    }
  }

  set all(value) {
    try {
      // Make sure the folder exists as it could have been deleted in the meantime
      fs.mkdirSync(path.dirname(this._path), mkdirOptions);

      writeFileAtomic.sync(
        this._path,
        JSON.stringify(value, undefined, '\t'),
        writeFileOptions
      );
    } catch (error) {
      // Improve the message of permission errors
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      throw error;
    }
  }

  get size() {
    return Object.keys(this.all || {}).length;
  }

  getItem(key: any) {
    return dotProp.get(this.all, key);
  }

  setItem(key: any, value: any) {
    const config = this.all;

    if (arguments.length === 1) {
      for (const k of Object.keys(key)) {
        dotProp.set(config, k, key[k]);
      }
    } else {
      dotProp.set(config, key, value);
    }

    this.all = config;
  }

  hasItem(key: any) {
    return dotProp.has(this.all, key);
  }

  removeItem(key: any) {
    const config = this.all;
    dotProp.delete(config, key);
    this.all = config;
  }

  clear() {
    this.all = {};
  }

  get path() {
    return this._path;
  }
}
