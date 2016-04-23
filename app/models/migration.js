import Model from '../lib/Model';
import Type from '../lib/Type';
import Schema  from '../lib/Schema';

class Migration extends Model {
  static version = 2;
  static collection = 'mungo_migrations';

  static schema = {
    collection: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    remove: Object,
    unset: new Schema({
      fields: [String],
      get: Object,
    }),
    update: new Schema({
      get: Object,
      set: Object,
    }),
  };
}

export default Migration;
