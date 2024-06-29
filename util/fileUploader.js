const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/awsConfig");
const { AWS_CREDENTIALS } = require("../config/env");
const multer = require("multer");
const multerS3 = require("multer-s3");


const fileUploader = async ( file, name ) => {
    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: AWS_CREDENTIALS.S3_BUCKET,
                Key: name,
                Body: Buffer.from(file.data, 'binary'),
            })
        );
        
        return true
    } catch (error) {
        return false;
    }
}

const multipleFileUploader = ( req, res ) => {
   uploadMul(req, res, function (err) {
    console.log(err)
   } )
    
    console.log("files_uploaded")
}


module.exports = {
    fileUploader,
}