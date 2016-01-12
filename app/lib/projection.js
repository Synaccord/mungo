'use strict';

class Projection {

  constructor (projection = {}) {
    this.setLimit(projection.limit);
    this.setSkip(projection.skip);
  }

  get default () {
    return {
      limit : 100,
      skip : 0
    };
  }

  setLimit (value) {
    if ( value === false ) {
      this.limit = 0;
    }
    else if ( typeof value === 'number' ) {
      this.limit = value;
    }
    else {
      this.limit = this.default.limit;
    }
    return this;
  }

  setSkip (value) {
    if ( typeof value === 'number' ) {
      this.skip = value;
    }
    else {
      this.skip = this.default.skip;
    }
  }

}

export default Projection;
