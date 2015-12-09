'use strict';

import Mungo from '..';

class Foo extends Mungo.Model {

  static schema () {
    return {
      arrayOfEmbeddedDocuments : [{
        stringOnly : String,
        arrayOfEmbeddedDocuments : [{
          stringOnly : String
        }]
      }]
    }
  }
}

export default Foo;
