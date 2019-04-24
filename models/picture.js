var fs = require('fs');
var multer = require('multer');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const pictureSchema = new Schema(
  img: { data: Buffer, contentType: String }
);

module.exports = mongoose.model('Picture', pictureSchema);