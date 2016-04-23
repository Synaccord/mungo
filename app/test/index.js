import 'should';
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
    it('module', it$module => {
      it$module('should be an object', () => Mungo.should.be.an.Object());

      it$module('Index', $Index$ => {
        $Index$('should be Index', () => Mungo
          .should.have.property('Index')
          .which.is.exactly(Index)
        );
      });

      it$module('Query', $Query$ => {
        $Query$('should be Query', () => Mungo
          .should.have.property('Query')
          .which.is.exactly(Query)
        );
      });

      it$module('Model', $Model$ => {
        $Model$('should be Model', () => Mungo
          .should.have.property('Model')
          .which.is.exactly(Model)
        );
      });

      it$module('Document', $Document$ => {
        $Document$('should be Document', () => Mungo
          .should.have.property('Document')
          .which.is.exactly(Document)
        );
      });

      it$module('Schema', $Schema$ => {
        $Schema$('should be Schema', () => Mungo
          .should.have.property('Schema')
          .which.is.exactly(Schema)
        );
      });

      it$module('Type', $Type$ => {
        $Type$('should be Type', () => Mungo
          .should.have.property('Type')
          .which.is.exactly(Type)
        );
      });

      it$module('Connection', $Connection$ => {
        $Connection$('should be Connection', () => Mungo
          .should.have.property('Connection')
          .which.is.exactly(Connection)
        );
      });

      it$module('Migration', $Migration$ => {
        $Migration$('should be Migration', () => Mungo
          .should.have.property('Migration')
          .which.is.exactly(Migration)
        );
      });

      it$module('Error', $Error$ => {
        $Error$('should be Error', () => Mungo
          .should.have.property('Error')
          .which.is.exactly(MungoError)
        );
      });

      it$module('FindStatement', $FindStatement$ => {
        $FindStatement$('should be FindStatement', () => Mungo
          .should.have.property('FindStatement')
          .which.is.exactly(FindStatement)
        );
      });

      it$module('UpdateStatement', $UpdateStatement$ => {
        $UpdateStatement$('should be UpdateStatement', () => Mungo
          .should.have.property('UpdateStatement')
          .which.is.exactly(UpdateStatement)
        );
      });

      it$module('Aliases', $Aliases$ => {
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
