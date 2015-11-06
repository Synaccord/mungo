'use strict';

import should from 'should';

should.Assertion.add('Date', function () {
  this.params = { operator: 'to be a Date', expected: Date };

  this.obj.should.be.an.instanceof(Date);

  this.obj.toString().should.not.be.exactly('Invalid Date');

});
