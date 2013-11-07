var path = require('path'),
rootPath = path.normalize(__dirname + '/..');

module.exports = {
    development: {
        baseUrl: 'http://localhost:5000',
        mode: 'development',
        root: rootPath,
        app: {
            name: 'Gate development'
        }
    },
    test: {
        baseUrl: 'https://www.jetpush.com',
        mode: 'test',
        root: rootPath,
        app: {
            name: 'Gate test'
        }
    },
    production: {
        baseUrl: 'https://www.jetpush.com',
        mode: 'production',
        root: rootPath,
        app: {
            name: 'Gate Production'
        }
    },
    staging: {
        baseUrl: 'https://staging.jetpush.com',
        mode: 'staging',
        root: rootPath,
        app: {
            name: 'Gate Staging'
        }
    }
};