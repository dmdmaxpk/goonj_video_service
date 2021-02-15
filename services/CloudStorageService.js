const AWS = require('aws-sdk');

const ID = 'AKIAZQA2XAWP5WFVOBU5';
const SECRET = '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';
let s3;
class CloudStorageService {
    
    constructor(){
        s3 = new AWS.S3({accessKeyId: ID,secretAccessKey: SECRET});
    }

    async uploadFile(postData) {

        let file = postData.file;
        let filename = postData.filename;
        let bucket_name = postData.bucket;
        let folderPath = postData.folderPath;

        let key = folderPath+"/"+filename;
        let params = {Bucket: bucket_name, Key: key, Body: file.data};

        try{
            let response = await this.uploadAndReturnPath(params);
            console.log('File uploaded successfully', response);

            return {status: true, file_path: response.Location, message: 'Successfully Uploaded'};
        }catch(err){
            return {status: false, message: err.message};
        }
    }

    async uploadAndReturnPath(params) {
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }
}

module.exports = CloudStorageService;