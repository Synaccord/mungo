import Connection from './lib/Connection';
import Index from './lib/Index';
import Query from './lib/Query';
import Model from './lib/Model';
import Document from './lib/Document';
import Schema from './lib/Schema';
import Type from './lib/Type';
import Migration from './lib/Migration';
import Error from './lib/Error';
import FindStatement from './lib/FindStatement';
import UpdateStatement from './lib/UpdateStatement';

export default {
  Connection,
  Index,
  Query,
  Model,
  Document,
  Schema,
  Type,
  Migration,
  Error,
  FindStatement,
  UpdateStatement,
  connect: ::Connection.connect,
  connectify: ::Connection.connectify,
  disconnect: ::Connection.disconnect,
  connections: Connection.connections,
};
