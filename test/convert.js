'use strict';

import should from 'should';
import Mungo from '../app';

class Bar extends Mungo.Model {
  static schema () {
    return {
      string : String
    }
  }
}

describe ( 'Convert' , function () {

  describe ( '<Number>' , function () {

    describe ( '{Number}' , function () {

      describe ( 'Integer' , function () {

        describe ( 'Positive' , function () {

          const converted = Mungo.convert(123, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a 123' , function () {

            converted.should.be.exactly(123);

          });

        });

        describe ( 'Negative' , function () {

          const converted = Mungo.convert(-123, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a -123' , function () {

            converted.should.be.exactly(-123);

          });

        });

      });

      describe ( 'Float' , function () {

        describe ( 'Positive' , function () {

          const converted = Mungo.convert(1.99, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a 1.99' , function () {

            converted.should.be.exactly(1.99);

          });

        });

        describe ( 'Negative' , function () {

          const converted = Mungo.convert(-1.99, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a -1.99' , function () {

            converted.should.be.exactly(-1.99);

          });

        });

      });

      describe ( 'Big number' , function () {

        describe ( 'Big' , function () {

          const converted = Mungo.convert(42e17, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a 42e17' , function () {

            converted.should.be.exactly(42e17);

          });

        });

        describe ( 'Small' , function () {

          const converted = Mungo.convert(42e-6, Number);

          it ( 'should be a number' , function () {

            converted.should.be.a.Number();

          });

          it ( 'should be a 42e-6' , function () {

            converted.should.be.exactly(42e-6);

          });

        });

      });

      describe ( 'Precision' , function () {

        const converted = Mungo.convert(1.023616785, Number);

        it ( 'should be a number' , function () {

          converted.should.be.a.Number();

        });

        it ( 'should be a 1.023616785' , function () {

          converted.should.be.exactly(1.023616785);

        });

      });

    });

    describe ( '{String}' , function () {

      describe ( 'numeric string' , function () {

        const converted = Mungo.convert('123', Number);

        it ( 'should be a number' , function () {

          converted.should.be.a.Number();

        });

        it ( 'should be a 123' , function () {

          converted.should.be.exactly(123);

        });

      });

      describe ( 'non-numeric string' , function () {

        it ( 'should be throw an error' , function () {

          () => { Mungo.convert('hello', Number) }.should.throw(Mungo.Error);

        });

      });

    });

    describe ( '{Boolean}' , function () {

      describe ( 'true', function () {

        const converted = Mungo.convert(true, Number);

        it ( 'should be a boolean' , function () {

          converted.should.be.a.Number();

        });

        it ( 'should be a 1' , function () {

          converted.should.be.exactly(1);

        });

      });

      describe ( 'false', function () {

        const converted = Mungo.convert(false, Number);

        it ( 'should be a boolean' , function () {

          converted.should.be.a.Number();

        });

        it ( 'should be a 0' , function () {

          converted.should.be.exactly(0);

        });

      });

    });

    describe ( '{Date}' , function () {

      const converted = Mungo.convert(new Date(), Number);

      it ( 'should be a number' , function () {

        converted.should.be.a.Number();

      });

      it ( 'should be a timestamp' , function () {

        (Date.now() - converted < 10).should.be.true;

      });

    });

    describe ( '{null}' , function () {

      const converted = Mungo.convert(null, Number);

      it ( 'should be a number', function () {

        converted.should.be.a.Number();

      });

      it ( 'should be 0' , function () {

        converted.should.be.exactly(0);

      });

    });

    describe ( '{undefined}' , function () {

      it ( 'should throw error', function () {

        () => { Mungo.convert(undefined, Number) }.should.throw(Mungo.Error);

      });

    });

    describe ( '{Array}' , function () {

      const converted = Mungo.convert([], Number);

      it ( 'should be a number', function () {

        converted.should.be.a.Number();

      });

      it ( 'should be 0', function () {

        converted.should.be.exactly(0);

      });

    });

    describe ( '{Object}' , function () {

      it ( 'should throw error', function () {

        () => { Mungo.convert({}, Number) }.should.throw(Mungo.Error);

      });

    });

    describe ( '{Infinity}' , function () {

      describe ( 'Infinity', function () {

        it ( 'should throw error', function () {

          () => { Mungo.convert(Infinity, Number) }.should.throw(Mungo.Error);

        });

      });

      describe ( '-Infinity', function () {

        it ( 'should throw error', function () {

          () => { Mungo.convert(-Infinity, Number) }.should.throw(Mungo.Error);

        });

      });

    });

    describe ( '{Octal}' , function () {

      const converted = Mungo.convert(0o644, Number);

      it ( 'should be a number', function () {
        converted.should.be.a.Number();
      });

      it ( 'should be 420' , function () {
        converted.should.be.exactly(420);
      });

    });

    describe ( '{Decimal}' , function () {

      const converted = Mungo.convert(0x3e71, Number);

      it ( 'should be a number', function () {
        converted.should.be.a.Number();
      });

      it ( 'should be 15985' , function () {
        converted.should.be.exactly(15985);
      });

    });

    describe ( '{Symbol}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(Symbol(1), Number) }.should.throw(Mungo.Error);
      });
    });

    describe ( '{Function}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(Function, Number) }.should.throw(Mungo.Error);
      });
    });

    describe ( '{Buffer}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(new Buffer(123), Number) }.should.throw(Mungo.Error);
      });
    });

    describe ( '{Binary}' , function () {

      const converted = Mungo.convert(0b11, Number);

      it ( 'should be a number', function () {

        converted.should.be.a.Number();

      });

      it ( 'should be 3', function () {

        converted.should.be.exactly(3);

      });

      describe ( 'base 2', function () {

        const base2 = Mungo.convert(0b0011, Number);

        it ( 'should be a number', function () {

          base2.should.be.a.Number();

        });

        it ( 'should be 3', function () {

          converted.should.be.exactly(3);

        });

      });
    });

    describe ( '{Model}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(new (Mungo.Model)(), Number) }.should.throw(Mungo.Error);
      });

    });

    describe ( '{ObjectID}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(Mungo.ObjectID(), Number) }.should.throw(Mungo.Error);
      });

    });

    describe ( '{Regex}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(/abc/, Number) }.should.throw(Mungo.Error);
      });

    });

    describe ( '{Error}' , function () {

      it ( 'should throw an eror', function () {
        () => { Mungo.convert(new Error('foo'), Number) }.should.throw(Mungo.Error);
      });

    });


  });

  describe ( '<String>' , function () {

    describe ( '{Number}' , function () {

      describe ( 'Integer' , function () {

        describe ( 'Positive' , function () {

          const converted = Mungo.convert(123, String);

          it ( 'should be a string' , function () {

            converted.should.be.a.String();

          });

          it ( 'should be a "123"' , function () {

            converted.should.be.exactly("123");

          });

        });

        describe ( 'Negative' , function () {

          const converted = Mungo.convert(-123, String);

          it ( 'should be a string' , function () {

            converted.should.be.a.String();

          });

          it ( 'should be a "-123"' , function () {

            converted.should.be.exactly("-123");

          });

        });

      });

      // describe ( 'Float' , function () {
      //
      //   describe ( 'Positive' , function () {
      //
      //     const converted = Mungo.convert(1.99, Number);
      //
      //     it ( 'should be a number' , function () {
      //
      //       converted.should.be.a.Number();
      //
      //     });
      //
      //     it ( 'should be a 1.99' , function () {
      //
      //       converted.should.be.exactly(1.99);
      //
      //     });
      //
      //   });
      //
      //   describe ( 'Negative' , function () {
      //
      //     const converted = Mungo.convert(-1.99, Number);
      //
      //     it ( 'should be a number' , function () {
      //
      //       converted.should.be.a.Number();
      //
      //     });
      //
      //     it ( 'should be a -1.99' , function () {
      //
      //       converted.should.be.exactly(-1.99);
      //
      //     });
      //
      //   });
      //
      // });
      //
      // describe ( 'Big number' , function () {
      //
      //   describe ( 'Big' , function () {
      //
      //     const converted = Mungo.convert(42e17, Number);
      //
      //     it ( 'should be a number' , function () {
      //
      //       converted.should.be.a.Number();
      //
      //     });
      //
      //     it ( 'should be a 42e17' , function () {
      //
      //       converted.should.be.exactly(42e17);
      //
      //     });
      //
      //   });
      //
      //   describe ( 'Small' , function () {
      //
      //     const converted = Mungo.convert(42e-6, Number);
      //
      //     it ( 'should be a number' , function () {
      //
      //       converted.should.be.a.Number();
      //
      //     });
      //
      //     it ( 'should be a 42e-6' , function () {
      //
      //       converted.should.be.exactly(42e-6);
      //
      //     });
      //
      //   });
      //
      // });
      //
      // describe ( 'Precision' , function () {
      //
      //   const converted = Mungo.convert(1.023616785, Number);
      //
      //   it ( 'should be a number' , function () {
      //
      //     converted.should.be.a.Number();
      //
      //   });
      //
      //   it ( 'should be a 1.023616785' , function () {
      //
      //     converted.should.be.exactly(1.023616785);
      //
      //   });
      //
      // });

    });

    // describe ( '{String}' , function () {
    //
    //   describe ( 'numeric string' , function () {
    //
    //     const converted = Mungo.convert('123', Number);
    //
    //     it ( 'should be a number' , function () {
    //
    //       converted.should.be.a.Number();
    //
    //     });
    //
    //     it ( 'should be a 123' , function () {
    //
    //       converted.should.be.exactly(123);
    //
    //     });
    //
    //   });
    //
    //   describe ( 'non-numeric string' , function () {
    //
    //     it ( 'should be throw an error' , function () {
    //
    //       () => { Mungo.convert('hello', Number) }.should.throw(Mungo.Error);
    //
    //     });
    //
    //   });
    //
    // });
    //
    // describe ( '{Boolean}' , function () {
    //
    //   describe ( 'true', function () {
    //
    //     const converted = Mungo.convert(true, Number);
    //
    //     it ( 'should be a boolean' , function () {
    //
    //       converted.should.be.a.Number();
    //
    //     });
    //
    //     it ( 'should be a 1' , function () {
    //
    //       converted.should.be.exactly(1);
    //
    //     });
    //
    //   });
    //
    //   describe ( 'false', function () {
    //
    //     const converted = Mungo.convert(false, Number);
    //
    //     it ( 'should be a boolean' , function () {
    //
    //       converted.should.be.a.Number();
    //
    //     });
    //
    //     it ( 'should be a 0' , function () {
    //
    //       converted.should.be.exactly(0);
    //
    //     });
    //
    //   });
    //
    // });
    //
    // describe ( '{Date}' , function () {
    //
    //   const converted = Mungo.convert(new Date(), Number);
    //
    //   it ( 'should be a number' , function () {
    //
    //     converted.should.be.a.Number();
    //
    //   });
    //
    //   it ( 'should be a timestamp' , function () {
    //
    //     (Date.now() - converted < 10).should.be.true;
    //
    //   });
    //
    // });
    //
    // describe ( '{null}' , function () {
    //
    //   const converted = Mungo.convert(null, Number);
    //
    //   it ( 'should be a number', function () {
    //
    //     converted.should.be.a.Number();
    //
    //   });
    //
    //   it ( 'should be 0' , function () {
    //
    //     converted.should.be.exactly(0);
    //
    //   });
    //
    // });
    //
    // describe ( '{undefined}' , function () {
    //
    //   it ( 'should throw error', function () {
    //
    //     () => { Mungo.convert(undefined, Number) }.should.throw(Mungo.Error);
    //
    //   });
    //
    // });
    //
    // describe ( '{Array}' , function () {
    //
    //   const converted = Mungo.convert([], Number);
    //
    //   it ( 'should be a number', function () {
    //
    //     converted.should.be.a.Number();
    //
    //   });
    //
    //   it ( 'should be 0', function () {
    //
    //     converted.should.be.exactly(0);
    //
    //   });
    //
    // });
    //
    // describe ( '{Object}' , function () {
    //
    //   it ( 'should throw error', function () {
    //
    //     () => { Mungo.convert({}, Number) }.should.throw(Mungo.Error);
    //
    //   });
    //
    // });
    //
    // describe ( '{Infinity}' , function () {
    //
    //   describe ( 'Infinity', function () {
    //
    //     it ( 'should throw error', function () {
    //
    //       () => { Mungo.convert(Infinity, Number) }.should.throw(Mungo.Error);
    //
    //     });
    //
    //   });
    //
    //   describe ( '-Infinity', function () {
    //
    //     it ( 'should throw error', function () {
    //
    //       () => { Mungo.convert(-Infinity, Number) }.should.throw(Mungo.Error);
    //
    //     });
    //
    //   });
    //
    // });
    //
    // describe ( '{Octal}' , function () {
    //
    //   const converted = Mungo.convert(0o644, Number);
    //
    //   it ( 'should be a number', function () {
    //     converted.should.be.a.Number();
    //   });
    //
    //   it ( 'should be 420' , function () {
    //     converted.should.be.exactly(420);
    //   });
    //
    // });
    //
    // describe ( '{Decimal}' , function () {
    //
    //   const converted = Mungo.convert(0x3e71, Number);
    //
    //   it ( 'should be a number', function () {
    //     converted.should.be.a.Number();
    //   });
    //
    //   it ( 'should be 15985' , function () {
    //     converted.should.be.exactly(15985);
    //   });
    //
    // });
    //
    // describe ( '{Symbol}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(Symbol(1), Number) }.should.throw(Mungo.Error);
    //   });
    // });
    //
    // describe ( '{Function}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(Function, Number) }.should.throw(Mungo.Error);
    //   });
    // });
    //
    // describe ( '{Buffer}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(new Buffer(123), Number) }.should.throw(Mungo.Error);
    //   });
    // });
    //
    // describe ( '{Binary}' , function () {
    //
    //   const converted = Mungo.convert(0b11, Number);
    //
    //   it ( 'should be a number', function () {
    //
    //     converted.should.be.a.Number();
    //
    //   });
    //
    //   it ( 'should be 3', function () {
    //
    //     converted.should.be.exactly(3);
    //
    //   });
    //
    //   describe ( 'base 2', function () {
    //
    //     const base2 = Mungo.convert(0b0011, Number);
    //
    //     it ( 'should be a number', function () {
    //
    //       base2.should.be.a.Number();
    //
    //     });
    //
    //     it ( 'should be 3', function () {
    //
    //       converted.should.be.exactly(3);
    //
    //     });
    //
    //   });
    // });
    //
    // describe ( '{Model}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(new (Mungo.Model)(), Number) }.should.throw(Mungo.Error);
    //   });
    //
    // });
    //
    // describe ( '{ObjectID}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(Mungo.ObjectID(), Number) }.should.throw(Mungo.Error);
    //   });
    //
    // });
    //
    // describe ( '{Regex}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(/abc/, Number) }.should.throw(Mungo.Error);
    //   });
    //
    // });
    //
    // describe ( '{Error}' , function () {
    //
    //   it ( 'should throw an eror', function () {
    //     () => { Mungo.convert(new Error('foo'), Number) }.should.throw(Mungo.Error);
    //   });
    //
    // });
    //

  });

});
