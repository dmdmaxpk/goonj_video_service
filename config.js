const env = process.env.NODE_ENV || 'development';
const s3ConfigObj = {
    s3BasePath: 'https://content-dmd.s3.eu-central-1.amazonaws.com/',
    s3Bucket: 'content-dmd',
    s3folderPath: 'TP-Content/Sliders'
}
// mongodb://10.3.7.101:27017/telenor_v2

let micro_services = {
    user_service: 'http://10.0.1.76:3007'
}
let config = {
    development: {
        port: '3000',
        s3ConfigObj: s3ConfigObj,
        mongoDB: 'mongodb://localhost:27017/telenor_v2',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode',
        micro_services: micro_services
    },
    staging: {
        port: '3001',
        s3ConfigObj: s3ConfigObj,
        mongoDB: 'mongodb://localhost:27017/telenor_v2',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode',
        micro_services: micro_services
    },
    production: {
        port: '3000',
        s3ConfigObj: s3ConfigObj,
        mongoDB: 'mongodb://RootAdmin:password@10.3.7.101:27017/telenor_v2?authSource=admin&replicaSet=prdreplica1',
        transcodeServiceUrl: 'http://10.3.7.12:3011/transcode',
        micro_services: micro_services
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;