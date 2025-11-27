import AWS from 'aws-sdk';
import Base64Binary from 'base64-arraybuffer';
//import fs from 'react-native-fs';
import fs from 'react-native-file-selector';
import * as mime from 'react-native-mime-types';
import { ENDPOINT, ACCESS_KEY, ACCESS_SECRET } from '../config';


const uploadImageOnS3 = async (file: any) => {
    return new Promise(async (resolve, reject) => {
        const s3bucket = new AWS.S3({
            accessKeyId: ACCESS_KEY,
            secretAccessKey: ACCESS_SECRET,
            ACL: 'public-read-write',
            endpoint: new aws.Endpoint(ENDPOINT),
            signatureVersion: 'v4',
        });

        // s3bucket.getBucketAcl({ Bucket: ENDPOINT}, function(err, data) {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else     console.log(data);           // successful response
        // });

        const base64 = await fs.readFile(file.path, 'base64');
        const contentType = file.mime;
        const fileName = file.fileName;
        const contentDeposition = 'inline;filename="' + fileName + '"';

        const arrayBuffer = Base64Binary.decode(base64);
        s3bucket.createBucket(()=>{
            const params = {
                bucket: ENDPOINT,
                Key: fileName,
                Body: arrayBuffer,
                ACL: 'public-read-write',
                ContentDisposition: contentDeposition,
                ContentType: contentType
            };
            s3bucket.upload(params, (err: any, data: any) =>{
                if(err){
                    reject(err);
                }else{
                    console.log(data);
                    resolve(data.Location)
                }
            });
        });
    }) ; 
};

export default uploadImageOnS3;