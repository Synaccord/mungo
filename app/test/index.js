import describe from 'redtea';
import Mungo from '..';
import json from '../../package.json';
import Index from '../lib/Index';
import Query from '../lib/Query';
import Model from '../lib/Model';
import Document from '../lib/Document';
import Schema from '../lib/Schema';
import Type from '../lib/Type';
import Connection from '../lib/Connection';
import Migration from '../lib/Migration';
import MungoError from '../lib/Error';
import FindStatement from '../lib/FindStatement';
import UpdateStatement from '../lib/UpdateStatement';

function test() {
  return describe('Mungo v' + json.version, it => {
    it('module', $module$ => {
      $module$('should be a class', () => Mungo.should.be.a.Function());

      $module$('Deprecated', $deprecated$ => {
        $deprecated$('Mixed', $Mixed$ => {
          $Mixed$('should exist', () => Mungo.should.have.property('Mixed'));
          $Mixed$('should be Type.Mixed',
            () => Mungo.Mixed.should.be.exactly(Type.Mixed)
          );
        });

        it('ObjectID', $objectID$ => {
          $objectID$('should exist',
            () => Mungo.should.have.property('ObjectID')
          );
          $objectID$('should be Type.ObjectID',
            () => Mungo.ObjectID.should.be.exactly(Type.ObjectID)
          );
        });
      });

      it('Index', $Index$ => {
        $Index$('should be Index', () => Mungo
          .should.have.property('Index')
          .which.is.exactly(Index)
        );
      });

      it('Query', $Query$ => {
        $Query$('should be Query', () => Mungo
          .should.have.property('Query')
          .which.is.exactly(Query)
        );
      });

      it('Model', $Model$ => {
        $Model$('should be Model', () => Mungo
          .should.have.property('Model')
          .which.is.exactly(Model)
        );
      });

      it('Document', $Document$ => {
        $Document$('should be Document', () => Mungo
          .should.have.property('Document')
          .which.is.exactly(Document)
        );
      });

      it('Schema', $Schema$ => {
        $Schema$('should be Schema', () => Mungo
          .should.have.property('Schema')
          .which.is.exactly(Schema)
        );
      });

      it('Type', $Type$ => {
        $Type$('should be Type', () => Mungo
          .should.have.property('Type')
          .which.is.exactly(Type)
        );
      });

      it('Connection', $Connection$ => {
        $Connection$('should be Connection', () => Mungo
          .should.have.property('Connection')
          .which.is.exactly(Connection)
        );
      });

      it('Migration', $Migration$ => {
        $Migration$('should be Migration', () => Mungo
          .should.have.property('Migration')
          .which.is.exactly(Migration)
        );
      });

      it('Error', $Error$ => {
        $Error$('should be Error', () => Mungo
          .should.have.property('Error')
          .which.is.exactly(MungoError)
        );
      });

      it('FindStatement', $FindStatement$ => {
        $FindStatement$('should be FindStatement', () => Mungo
          .should.have.property('FindStatement')
          .which.is.exactly(FindStatement)
        );
      });

      it('UpdateStatement', $UpdateStatement$ => {
        $UpdateStatement$('should be UpdateStatement', () => Mungo
          .should.have.property('UpdateStatement')
          .which.is.exactly(UpdateStatement)
        );
      });

      it('Aliases', $Aliases$ => {
        $Aliases$('Connect', $Connect$ => {
          $Connect$('connect()', $connect$ => {
            $connect$('should be Connection.connect()', () =>
              Mungo.should.have.property('connect')
                .which.is.a.Function()
            );
          });

          $Connect$('disconnect()', $disconnect$ => {
            $disconnect$('should be Connection.disconnect()', () =>
              Mungo.should.have.property('disconnect')
                .which.is.a.Function()
            );
          });

          $Connect$('connectify()', $connectify$ => {
            $connectify$('should be Connection.connectify()', () =>
              Mungo.should.have.property('connectify')
                .which.is.a.Function()
            );
          });

          $Connect$('connections', it$$connections => {
            it$$connections('should be Connection.connections', () =>
              Mungo.should.have.property('connections')
                .which.is.an.Array()
            );
          });
        });
      });
    });
  });
}

export default test;
