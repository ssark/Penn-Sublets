var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var moment = require('moment')

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "e6pLEOxq3z6ohyy6tzt2oBpzcvEv7FQ9p3XuzFx3",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "AKIAI2PB7D3PXBP4F55A",
    region: 'us-east-1' // region of your bucket
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'pennsublet-listing-pictures',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, req.params.listingId + moment())
    }
  })
})
module.exports = {upload, s3};