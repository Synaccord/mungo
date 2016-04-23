import {Readable} from 'stream';

export default class Streamable extends Readable {
  constructor() {
    super({
      encoding: 'utf8'
    });
    this.setEncoding('utf8');
    this.collection = [];
  }

  // _read(data) {}

  add(...docs) {
    this.resume();
    this.emit('readable');
    docs.map(doc => doc.toJSON());
    const source = JSON.stringify(docs);
    this.emit('data', source);
  }

  end() {
    this.emit('end');
  }
}
