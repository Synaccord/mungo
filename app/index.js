import Connection from './lib/Connection';

export {default as Index} from './lib/Index';
export {default as Query} from './lib/Query';
export {default as Model} from './lib/Model';
export {default as Document} from './lib/Document';
export {default as Schema} from './lib/Schema';
export {default as Type} from './lib/Type';
export {default as Migration} from './lib/Migration';
export {default as Error} from './lib/Error';
export {default as FindStatement} from './lib/FindStatement';
export {default as UpdateStatement} from './lib/UpdateStatement';

export const connect = ::Connection.connect;
export const connectify = ::Connection.connectify;
export const disconnect = ::Connection.disconnect;
