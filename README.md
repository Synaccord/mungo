Mungo
===

Schema models for MongoDB

# Install

```bash
npm install mungo
```

# Overview

`Mungo` is a library to create models for MongoDB.

# Usage

```js
import Mungo from 'mungo';

class User extends Mungo.Model {
  static schema = { username : String }
}

// Connect to MongoDB
Mungo.connect('mongodb://@localhost');

// Create a new user
User.create({ username : 'dude' });

// Find user
User.find({ username : 'dude' });

// Update user
User.update({ username : 'dude' });

// Remove user
User.remove({ username : 'dude' });
```

# Schema

## Type

```js
class User extends Mungo.Model {
  static schema = { username : String, score : Number }
}
```

### Types allowed

- `String`
- `Number`
- `Boolean`
- `Date`
- `Array` **for a better array control, see below**
- `Object` **for a better subdocument control, see below**
- `Subdocument` **see below**
- `ObjectID` **MongoDB's object id**
- `Mixed` **accepts any type**

### Array of types

You can enclose types inside arrays:

```js
// { numbers : [1, 2, 3] }

class Foo extends Mungo.Model {
  static schema = { numbers : [Number] }
}
```

### Sudocuments

Use the `Subdocument` to embed a document:

```js
// { foo : { bar : true } }

class Foo extends Mungo.Model {
  static schema = {
    foo : new (Mungo.Subdocument)({ bar : Boolean })
  }
}
```

You could also use directly the object notation such as:

```js
// { foo : { bar : true } }

class Foo extends Mungo.Model {
  static schema = {
    foo : { bar : Boolean }
  }
}
```

But **you have to make sure your subdocument does not contain a `type` property** - otherwise it will be mistaken with a field description.

### References to other model

Use the name of the model you want to refer :

```js

class Team extends Mungo.Model {
  static schema = { name : String }
}

class Player extends Mungo.Model {
  static schema = { team : Team }
}
```
