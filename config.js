const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        port: '3003',
    },
    staging: {
        port: '3000',
    },
    production: {
        port: '3000',
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

// Common configs
config.mongoDB = 'mongodb://localhost:27017/mongoose';
config.transcodeServiceUrl = 'http://10.3.7.12:3011/v1/api/transcode';

module.exports = config;
