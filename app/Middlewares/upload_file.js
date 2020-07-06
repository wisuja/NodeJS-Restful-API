const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
    cb(null, true);
  else
    cb(new Error("JPEG/PNG file formats only"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: 1024 * 1024 * 5
});

module.exports = upload;