'use strict';
const expect = require('chai').expect;

const plugin = require('./index.js');

describe('Normal behaviour', () => {
    let schema, filterMethod;
    let model = {
        username: 'JamyDev',
        password: 'Pass123',
        email: 'jamy@example.com',
        id: 'asdfasdfadf',
        tfa: true
    };

    before(() => {
        schema = {
            tree: {
                id: {
                    type: String
                },
                username: {
                    type: String,
                    scopes: ['public']
                },
                password: {
                    type: String,
                    scopes: []
                },
                email: {
                    type: String,
                    scopes: ['private', 'writable']
                },
                tfa: {
                    type: Boolean,
                    scopes: ['writable']
                }
            },
            options: {
                defaultScope: 'public'
            },
            static: (token, method) => model.getScoped = (scopes) => method(model, scopes),
            method: () => {}
        };

        plugin(schema);
    });

    it('should return default properties', () => {
        expect(model.getScoped()).to.deep.equal({ id: 'asdfasdfadf', username: 'JamyDev' });
    });

    it('should return the id always', () => {
        expect(model.getScoped()).to.have.property('id');
        expect(model.getScoped('private')).to.have.property('id');
        expect(model.getScoped('writable')).to.have.property('id');
    });

    it('should return properties for multiple scopes', () => {
        expect(model.getScoped(['public', 'writable'])).to.deep.equal({ id: 'asdfasdfadf', username: 'JamyDev', email: 'jamy@example.com', tfa: true });
    });

    it('should ignore invalid calls', () => {
        expect(model.getScoped(true)).to.equal(null);
        expect(model.getScoped({object: true})).to.equal(null);
        expect(model.getScoped(NaN)).to.equal(null);
    });

    it('should ignore invalid scopes', () => {
        expect(model.getScoped('this is not a scope')).to.deep.equal({ id: 'asdfasdfadf' });
        expect(model.getScoped(['\' AND 1=1 %', 'false'])).to.deep.equal({ id: 'asdfasdfadf' });
    });
});

describe('No default', () => {
    let schema, filterMethod;
    let model = {
        username: 'JamyDev',
        password: 'Pass123',
        email: 'jamy@example.com',
        id: 'asdfasdfadf',
        tfa: true
    };

    before(() => {
        schema = {
            tree: {
                id: {
                    type: String
                },
                username: {
                    type: String,
                    scopes: ['public']
                },
                password: {
                    type: String,
                    scopes: []
                },
                email: {
                    type: String,
                    scopes: ['private', 'writable']
                },
                tfa: {
                    type: Boolean,
                    scopes: ['writable']
                }
            },
            static: (token, method) => model.getScoped = (scopes) => method(model, scopes),
            method: () => {}
        };

        plugin(schema);
    });

    it('should not return default properties', () => {
        expect(model.getScoped()).to.equal(null);
    });

    it('should return the id always', () => {
        expect(model.getScoped()).to.equal(null);
        expect(model.getScoped('private')).to.have.property('id');
        expect(model.getScoped('writable')).to.have.property('id');
    });

    it('should return properties for multiple scopes', () => {
        expect(model.getScoped(['public', 'writable'])).to.deep.equal({ id: 'asdfasdfadf', username: 'JamyDev', email: 'jamy@example.com', tfa: true });
    });

    it('should ignore invalid calls', () => {
        expect(model.getScoped(true)).to.equal(null);
        expect(model.getScoped({object: true})).to.equal(null);
        expect(model.getScoped(NaN)).to.equal(null);
    });

    it('should ignore invalid scopes', () => {
        expect(model.getScoped('this is not a scope')).to.deep.equal({ id: 'asdfasdfadf' });
        expect(model.getScoped(['\' AND 1=1 %', 'false'])).to.deep.equal({ id: 'asdfasdfadf' });
    });
});