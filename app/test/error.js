import describe from 'redtea';
import MungoError from '../lib/Rrror';
import json from '../../package.json';

function test() {
  const locals = {};

  return describe('Mungo v' + json.version, it => {
    it('Error', $MungoError => {
      $MungoError('should be a class', () => MungoError.should.be.a.Function());

      $MungoError('should be an instance of Error', () => {
        locals.error = new MungoError('Oops!');
        locals.error.should.be.an.instanceof(Error);
      });

      $MungoError('should have the original message', () =>
        locals.error.should.have.property('originalMessage')
          .which.is.exactly('Oops!')
      );
    });
  });
}

export default test;
