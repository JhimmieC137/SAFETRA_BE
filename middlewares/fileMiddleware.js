const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/awsConfig");
const { AWS_CREDENTIALS } = require("../config/env");
const { S3Client } = require("@aws-sdk/client-s3");

const MULTER_S3_CONFIG = multerS3({
    s3: s3Client,
    bucket: AWS_CREDENTIALS.S3_BUCKET,
    
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, 'new_file')
    }
})


const multipleUpload = multer({storage: MULTER_S3_CONFIG})

const uploadMiddleware = (req, res, next) => {
    // Use multer upload instance
    multipleUpload.array('files', 5)(req, res, (err) => {
    if (err) {
        console.log(err)
        return res.status(400).json({
            status: 'Failure',
            error: 'Error uploading file(s)' 
        });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
            // errors.push(`Invalid file type: ${file.originalname}`);
            return res.status(400).json({ 
                status: 'Failure',
                error: `Invalid file type: ${file.originalname}` 
            });
        }

        if (file.size > maxSize) {
            // errors.push(`File too large: ${file.originalname}`);
            return res.status(400).json({ 
                status: 'Failure',
                error: `File too large: ${file.originalname}` 
            });
        }
    });

    // Handle validation errors
    if (errors.length > 0) {
        // Remove uploaded files
        files.forEach((file) => {
            files.pop(file)
        });

        return res.status(400).json({ 
            status: 'Failure',
            error: 'Error uploading file(s)' 
        });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};


module.exports = {
    uploadMiddleware
}