'use strict';

const _ = require('lodash');
module.exports = function mongooseScopes(schema, opts) {
    const defaultScope = schema.options && schema.options.defaultScope;

    function filterScopes(data, scopes) {
        let scopesArr = [];

        if (_.isNil(scopes) && defaultScope) {
            scopesArr.push(defaultScope);
        } else if (_.isString(scopes)) {
            scopesArr.push(scopes);
        } else if (_.isArray(scopes)) {
            scopesArr = scopes;
        } else {
            // Invalid input for scopes
            return null;
        }

        const props = [];
        _.forEach(schema.tree, (value, key) => {
            let display = _.some(scopesArr, sc => _.includes(value.scopes || [], sc));

            if (display || (key === 'id')) { // Show if visible or if id
                props.push(key);
            }
        });

        return _.pick(data, props);
    }

    schema.static('getScoped', filterScopes);

    schema.method('getScoped', function (scopes) {
        return filterScopes(instance, this);
    });
};