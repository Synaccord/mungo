'use strict';

import Schema                     from  './schema';
import deprecatedNotice           from './deprecated-notice';
import ModelQuery                 from './model-query';

class ModelStatic extends ModelQuery {

  //---------------------------------------------------------------------------

  // Static properties

  //---------------------------------------------------------------------------

  static version = 0

  //----------------------------------------------------------------------------

  static schema = {}

  /** @type {Schema} */

  static _schema

  //---------------------------------------------------------------------------

  // Static getters

  //----------------------------------------------------------------------------

  /** @return [Index] */

  static get indexes () {
    return this.getSchema().indexes;
  }

  //---------------------------------------------------------------------------

  /** @return {String} */

  static get collection () {
    return this.name.toLowerCase() + 's';
  }

  //----------------------------------------------------------------------------

  // Static methods

  //----------------------------------------------------------------------------

  /** @return {Schema} */

  static getSchema () {
    if ( this._schema ) {
      return this._schema;
    }

    if ( typeof this.schema === 'object' ) {
      this._schema = new Schema(this.schema, this.version);
    }

    return this._schema;
  }

  //----------------------------------------------------------------------------

  static updating() { return [] }
  static updated() { return [] }
  static inserting() { return [] }
  static inserted() { return [] }
  static removing() { return [] }
  static removed() { return [] }

}

export default ModelStatic;
