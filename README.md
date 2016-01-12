Mungo
===

MongoDB models.

# Install

```
npm install mungo
```

# Usage

Use Mungo to declare data models and perform DB ops.

```js
import Mungo from 'mungo';

// Define a model

class Player extends Munog.Model {

  static schema = {
    name        :   {
      type      :   String,
      required  :   true,
      unique    :   true
    },

    email       :   {
      type      :   String,
      validate  :   /^.+@.+\..+$/
    },

    score       :   {
      type      :   Number,
      default   :   100
    }
  }

}

// Perform ops

Player
  .create({ name : 'Rebecca' })
  .then(() => {
    Player
      .find({ score : { $gt : 100 } })
      .then(players => console.log(players));
      // [{ name : "Revecca", score : 100 }]
  })
```

Apart from static access, you can also instantiate models:

```js
// new Player
const player = new Player({ name : 'Jo' });

// Insert in DB
player.save().then(() => {
  // Update object and save changes in DB
  player.set('score', 1000).save();
})
```

Browse the docs for more usage info.
