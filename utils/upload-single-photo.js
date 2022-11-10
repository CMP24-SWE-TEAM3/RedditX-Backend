const multer = require("multer");

const multerStorage = multer.memoryStorage();

/**
 * Filter from files that are not images
 */
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

/**
 * Upload single file
 */
module.exports = startUploadSinglePhoto = upload.single("attachment");
