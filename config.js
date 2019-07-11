const env = process.env.NODE_ENV || 'development';

// environment is picked from either system envs or from this file in above directive.

let config = {
    development: {
        port: '3000',
        mongoDB: 'mongodb://localhost:27017/telenor',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    },
    staging: {
        port: '3000',
        mongoDB: 'mongodb://localhost:27017/telenor',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    },
    production: {
        port: '3000',
        mongoDB: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor?authSource=admin&replicaSet=prdreplica1',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
