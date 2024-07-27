const multer = require('multer');

// multer configuration
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, file.originalname);
    },
});

const upload = multer({
    storage: multerStorage
});

module.exports = {
    upload
}