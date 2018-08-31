const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3000',
        mongoDB: 'mongodb://localhost:27017/telenor',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    },
    staging: {
        port: '3000',
        mongoDB: 'mongodb://localhost:27017/telenor',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    },
    production: {
        port: '3000',
        mongoDB: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor?authSource=admin',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
