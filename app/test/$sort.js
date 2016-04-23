import 'should';
import describe from 'redtea';
import Mungo from '../';
import FindStatement from '../lib/FindStatement';

class Foo extends Mungo.Model {
  static schema = {foo: String};
}

function test() {
  const locals = {};

  return describe('$sort', it => {
    it('should instantiate a new FindStatement', () => {
      locals.query = new FindStatement({$sort: {foo: 1}}, Foo);
    });

    it('should have a projection property', () => {
      locals.query.should.have.property('$projection').which.is.an.Object();
    });

    it('should have a sort', () => {
      locals.query.$projection.should.have.property('sort')
        .which.is.an.Object();
    });

    it('should be a sorter', () => {
      locals.query.$projection.sort.should.have.property('foo')
        .which.is.exactly(1);
    });
  });
}

export default test;
