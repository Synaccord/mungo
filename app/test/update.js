import describe from 'redtea';
import Mungo from '..';

class Foo extends Mungo.Model {
  static collection = 'mungo_test_update';

  static schema = {
    number: Number,
  };
}

function test() {
  const locals = {};

  return describe('Update', it$Update => {
    it$Update('Connect', () => new Promise((pass, fail) => {
      Mungo.connect(process.env.MUNGO_URL || 'mongodb://localhost/test')
        .on('error', fail)
        .on('connected', pass);
    }));

    it$Update('Create documents', it$CreateDocuments => {
      for (let number = 0; number < 1; number++) {
        it$CreateDocuments(`Create {number: ${number}}`,
          () => Foo.insert({number})
        );
      }
    });

    it$Update('Document\'s version should be 0', it$DocVersionIsZero => {
      it$DocVersionIsZero('Fetch document',
        () => Foo.findOne().then(doc => {
          locals.doc = doc;
        })
      );

      it$DocVersionIsZero('__v should be 0', () => {
        locals.doc.should.have.property('__v').which.is.exactly(0);
      });
    });

    it$Update('Direct update', it$DirectUpdate => {
      it$DirectUpdate('Update document', () => Foo
        .update({}, {$inc: {number: 1}})
        .then(docs => {
          locals.doc = docs[0];
        })
      );

      it$DirectUpdate('__v should be 1',
        () => locals.doc.should.have.property('__v').which.is.exactly(1)
      );

      it$DirectUpdate('Document\'s version should be 1', it$DocVersionIsOne => {
        it$DocVersionIsOne('Fetch document',
          () => Foo.findOne().then(doc => {
            locals.doc = doc;
          })
        );

        it$DocVersionIsOne('__v should be 1', () => {
          locals.doc.should.have.property('__v').which.is.exactly(1);
        });
      });
    });

    it$Update('Indirect update', it$IndirectUpdate => {
      it$IndirectUpdate('Find one', it$FindOne => {
        it$FindOne('Update document by fetching it',
          () => new Promise((pass, fail) => {
            Foo.findOne()
              .then(doc => {
                locals.doc = doc;
                doc.set('number', 100).save().then(pass, fail);
              })
              .catch(fail);
          })
        );

        it$FindOne('Document\'s version should be 2', it$DocVersionIs2 => {
          it$DocVersionIs2('Fetch document',
            () => Foo.findOne().then(doc => {
              locals.doc = doc;
            }));

          it$DocVersionIs2('__v should be 2', () => {
            locals.doc.should.have.property('__v').which.is.exactly(2);
          });
        });
      });

      it$IndirectUpdate('Find', it$Find => {
        it$Find('Empty collection', () => Foo.remove());

        it$Find('Create {number: 10}', () => Foo.insert({number: 10}));

        it$Find('Update document by fetching it',
          () => new Promise((pass, fail) => {
            Foo.find()
              .then(docs => {
                Promise
                  .all(docs.map(doc => doc.set('number', 100).save()))
                  .then(pass, fail);
              })
              .catch(fail);
          })
        );

        it$Find('Document\'s version should be 1', it$DocVersionIs1 => {
          it$DocVersionIs1('Fetch document',
            () => Foo.findOne().then(doc => {
              locals.doc = doc;
            })
          );

          it$DocVersionIs1('__v should be 1', () => {
            locals.doc.should.have.property('__v').which.is.exactly(1);
          });
        });
      });
    });

    it$Update('Empty collection', () => Foo.remove());
  });
}

export default test;
