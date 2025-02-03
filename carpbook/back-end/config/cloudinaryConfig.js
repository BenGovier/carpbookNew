const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_dvwtyoyol,
  api_key: process.env.CLOUDINARY_152791659377497,
  api_secret: process.env.CLOUDINARY_SGZgpqbeCs1ip7GS6k1N4QntDgc
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carpbook_fish_photos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;