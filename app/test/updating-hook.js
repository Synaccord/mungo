import 'should';
import describe from 'redtea';
import Mungo from '..';

class Foo extends Mungo.Model {
  static collection = 'mungo_test_updating_hook';

  static schema = {
    number: Number,
    touched: {
      type: Number,
      default: 0,
    },
  };

  static updating () {
    return [::this.touching];
  }

  static touching (doc) {
    return new Promise((pass) => {
      doc.increment('touched', 1);
      pass();
    });
  }
}

function test() {
  const locals = {};

  return describe('Updating hook', it$UpdatingHook => {
    it$UpdatingHook('Connect', () => new Promise((pass, fail) => {
      Mungo.connect(process.env.MUNGO_URL || 'mongodb://localhost/test')
        .on('error', fail)
        .on('connected', pass);
    }));

    it$UpdatingHook('Create documents', it$CreateDoc => {
      it$CreateDoc('Model.create({ number : 0 })',
        () => Foo.insert({number: 0})
      );
    });

    it$UpdatingHook('Direct update', it$DirectUpdate => {
      it$DirectUpdate('Model.update({ number : 1 })',
        () => Foo.update({}, {number: 1})
      );

      it$DirectUpdate('fetch document',
        () => Foo.findOne().then(doc => {
          locals.doc = doc;
        })
      );

      it$DirectUpdate('touched should be 1',
        () => locals.doc.should.have.property('touched').which.is.exactly(1)
      );
    });

    it$UpdatingHook('Empty collection', () => Foo.remove());
  });
}

export default test;
