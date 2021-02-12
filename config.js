const env = process.env.NODE_ENV || 'production';

let config = {
    development: {
        port: '3000',
        mongoDB: 'mongodb://10.3.7.101:27017/telenor_v2',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    },
    staging: {
        port: '3001',
        mongoDB: 'mongodb://10.3.7.101:27017telenor_v2',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    },
    production: {
        port: '3000',
        mongoDB: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor_v2?authSource=admin&replicaSet=prdreplica1',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode'
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;