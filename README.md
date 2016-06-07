# mongoose-scopes

Scoping for your Mongoose model properties.

## Installation

To apply to your mongoose model:

```javascript
const mongoose = require('mongoose');
const scopesPlugin = require('mongoose-scopes');

// Apply to all Schema's
mongoose.plugin(scopesPlugin);

// Apply to one schema
schema.plugin(scopesPlugin);
```

## Usage

```javascript
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        scopes: ['public', 'protected'],
    },
    password: {
        type: String,
        scopes: ['writable'],
    },
    email: {
        type: String,
        scopes: ['protected', 'writable'],
    },
    balance: {
        type: Number,
        scopes: ['protected']
    },
}, {
    defaultScope: 'public',
});

const User = mongoose.model('User', UserSchema);

// Filter an external object
User.getScoped(externalData, 'writable'); // Yields: { email, password }

// Filter an instance
const user = new User(/** data */);
user.getScoped('public'); // Yields: { id, username }
// The string version of id will always be returned when available

// Using multiple scopes
user.getScoped(['public', 'protected']) // Yields: { id, email, balance }

// Using defaultScope
user.getScoped(); // Yields: user.getScoped('public');
```

## Options

- `defaultScope`: Define a default scope to use if on of the `get` methods is ran without scope argument.

## License

MIT
