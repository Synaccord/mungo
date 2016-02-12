'use strict';

import describe           from 'redtea';
import should             from 'should';
import MungoError         from '../lib/error';
import Model              from '../lib/model';
import json               from '../../package.json';

function test(props = {}) {
  const locals = {};

  return describe('Mungo v' + json.version, it => {
    it('Model / Error', it => {
      it('should be a class', () =>
        Model.MungoModelError.should.be.a.Function()
      );

      it('should be an instance of Mungo Error', () => {
        locals.error = new (Model.MungoModelError)('Oops!');
        locals.error.should.be.an.instanceof(MungoError);
      });
    });
  });
}

export default test;
