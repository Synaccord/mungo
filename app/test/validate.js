'use strict';

import describe             from '../lib/describe';
import Mungo                from '..';
import should               from 'should';
import values               from './values';

function test () {
  return describe('Validate', [
    {
      Number : [
        {
          'Number' : [
            {
              'Integer' : [
                {
                  'Positive' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.integer.positive, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.integer.positive, Number, true).should.be.true();

                        ok();
                      }
                    }
                  ]
                },
                {
                  'Negative' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.integer.negative, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.integer.negative, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                }
              ]
            },
            {
              'Float' : [
                {
                  'Positive' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.float.positive, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.float.positive, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                },
                {
                  'Negative' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.float.negative, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.float.negative, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                }
              ]
            },
            {
              'Big number' : [
                {
                  'Very big' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.very.big, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.very.big, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                },
                {
                  'Very small' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.very.small, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.very.small, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                }
              ]
            },
            {
              'Precision' : [
                {
                  'Precise' : [
                    {
                      'Strict = true' : (ok, ko) => {
                        Mungo.validate(values.Number.precision, Number)
                          .should.be.true();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Number.precision, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'String' : [
            {
              'empty' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.String.empty, Number)
                      .should.be.false();

                    ok();
                  }
                },
                {
                  'Lazy = false' : (ok, ko) => {
                    Mungo.validate(values.String.alpha, Number, true)
                      .should.be.false();

                    ok();
                  }
                }
              ]
            },
            {
              'alpha' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.String.alpha, Number)
                      .should.be.false();

                    ok();
                  }
                },
                {
                  'Lazy = false' : (ok, ko) => {
                    Mungo.validate(values.String.alpha, Number, true)
                      .should.be.false();

                    ok();
                  }
                }
              ]
            },
            {
              'numeric' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.String.numeric, Number)
                      .should.be.false();

                    ok();
                  }
                },
                {
                  'Lazy = true' : (ok, ko) => {
                    Mungo.validate(values.String.numeric, Number, true)
                      .should.be.true();

                    ok();
                  }
                }
              ]
            }
          ]
        },
        {
          'Boolean' : [
            {
              'true' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.Boolean.true, Number)
                      .should.be.false();

                    ok();
                  }
                },
                {
                  'Lazy = true' : (ok, ko) => {
                    Mungo.validate(values.Boolean.true, Number, true)
                      .should.be.true();

                    ok();
                  }
                }
              ]
            },
            {
              'false' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.Boolean.false, Number)
                      .should.be.false();

                    ok();
                  }
                },

                {
                  'Lazy = true' : (ok, ko) => {
                    Mungo.validate(values.Boolean.false, Number, true)
                      .should.be.true();

                    ok();
                  }
                }
              ]
            }
          ]
        },
        {
          'Date' : [
            {
              'Strict = false' : (ok, ko) => {
                Mungo.validate(values.Date, Number)
                  .should.be.false();

                ok();
              }
            },
            {
              'Lazy = true' : (ok, ko) => {
                Mungo.validate(values.Date, Number, true)
                  .should.be.true();

                ok();
              }
            }
          ]
        },
        {
          'null' : [
            {
              'Strict = false' : (ok, ko) => {
                Mungo.validate(values.null, Number)
                  .should.be.false();

                ok();
              }
            },
            {
              'Lazy = true' : (ok, ko) => {
                Mungo.validate(values.null, Number, true)
                  .should.be.true();

                ok();
              }
            }
          ]
        },
        {
          'undefined' : [
            {
              'Strict = false' : (ok, ko) => {
                Mungo.validate(values.undefined, Number)
                  .should.be.false();

                ok();
              }
            },
            {
              'Lazy = false' : (ok, ko) => {
                Mungo.validate(values.undefined, Number, true)
                  .should.be.false();

                ok();
              }
            }
          ]
        },
        {
          'Array' : [
            {
              'empty' : [
                {
                  'Strict = false' : (ok, ko) => {
                    Mungo.validate(values.Array.empty, Number)
                      .should.be.false();

                    ok();
                  }
                },
                {
                  'Lazy = true' : (ok, ko) => {
                    Mungo.validate(values.Array.empty, Number, true)
                      .should.be.true();

                    ok();
                  }
                }
              ]
            },
            {
              'Number' : [
                {
                  'integer' : [
                    {
                      'Strict = false' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.integer, Number)
                          .should.be.false();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.integer, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                },
                {
                  'float' : [
                    {
                      'Strict = false' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.float, Number)
                          .should.be.false();

                        ok();
                      }
                    },
                    {
                      'Lazy = true' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.float, Number, true)
                          .should.be.true();

                        ok();
                      }
                    }
                  ]
                },
                {
                  'big numbers' : [
                    {
                      'Strict = false' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.big, Number)
                          .should.be.false();

                        ok();
                      }
                    },
                    {
                      'Lazy = false' : (ok, ko) => {
                        Mungo.validate(values.Array.Number.big, Number, true)
                          .should.be.false();

                        ok();
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
}


export default test;
