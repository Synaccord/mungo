import describe from 'redtea';
import 'should';
import Mungo from '..';

class Foo extends Mungo.Model {
  static collection = 'mungo_test_find_one_projection';

  static schema = {
    number: Number,
  };
}

function test() {
  const locals = {};

  return describe('Find One - Projection', it => {
    it('Connect', () => new Promise((pass, fail) => {
      Mungo.connect(process.env.MUNGO_URL || 'mongodb://localhost/test')
        .on('error', fail)
        .on('connected', pass);
    }));

    it('Create documents', $$$create_document => {
      for (let number = 0; number < 5; number++) {
        $$$create_document(`Create { number : ${number} }`,
          () => Foo.insert({number})
        );
      }
    });

    it('Find One - sort', $$find_one_sort => {
      $$find_one_sort('Sort up', $$sort_up => {
        $$sort_up('findOne().sort({ number : 1 })', () => Foo
          .findOne()
          .sort({number: 1})
          .then(result => {
            locals.result = result;
          })
        );

        $$sort_up('should have 1 result', () => {
          return locals.result.should.be.an.Object;
        });

        $$sort_up('it should be the lowest number', () => {
          locals.result.should.have.property('number').which.is.exactly(0);
        });
      });

      $$find_one_sort('Sort down', $$sort_down => {
        $$sort_down('findOne().sort({ number : -1 })', () => Foo
          .findOne()
          .sort({number: -1})
          .then(result => {
            locals.result = result;
          })
        );

        $$sort_down('should have 1 result', () => {
          return locals.result.should.be.an.Object;
        });

        $$sort_down('it should be the highest number', () => {
          locals.result.should.have.property('number').which.is.exactly(4);
        });
      });
    });

    it('Empty collection', () => Foo.remove());
  });
}

export default test;
