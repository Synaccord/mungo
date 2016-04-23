import 'should';
import describe from 'redtea';
import Mungo from '..';

class Foo extends Mungo.Model {
  static collection = 'mungo_test_find_operators';

  static schema = {
    string: String,
    number: Number,
    date: Date,
  };
}

function test() {
  const locals = {};

  return describe('Find / Statement', it => {
    it('Connect', () => new Promise((pass, fail) => {
      Mungo.connect(process.env.MUNGO_URL || 'mongodb://localhost/test')
        .on('error', fail)
        .on('connected', pass);
    }));

    it('Create documents', $create_documents$ => {
      for (let number = 0; number < 5; number++) {
        $create_documents$(`Create { number : ${number} }`,
          () => Foo.insert({number})
        );
      }
    });

    it('$lt', $lt => {
      $lt('{ number : { $lt : 2 } }', () => Foo
        .find({number: {$lt: 2}})
        .then(result => {
          locals.result = result;
        })
      );

      $lt('should have 2 results', () => {
        locals.result.should.have.length(2);
      });

      $lt('all results should be below 2', () => {
        locals.result.forEach(result => result.number.should.be.below(2));
      });
    });

    it('Empty collection', () => Foo.remove());
  });
}

export default test;
