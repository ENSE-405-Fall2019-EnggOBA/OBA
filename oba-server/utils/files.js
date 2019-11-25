const multer = require("multer");

const multer_multi_doc_upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes("text/plain") &&
      !file.mimetype.includes("application/msword") &&
      !file.mimetype.includes("application/pdf")
    )
      return cb(
        new multer.MulterError("Invalid file ext supplied for documents"),
        false
      );
    cb(null, true);
  },
  dest: "uploads/docs"
}).any();

const multer_single_file_upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes("image/bmp") &&
      !file.mimetype.includes("image/jpeg") &&
      !file.mimetype.includes("image/png")
    )
      return cb(
        new multer.MulterError("Invalid file ext supplied for avatar"),
        false
      );
    cb(null, true);
  },
  dest: "uploads/avatars"
}).fields([{ name: "avatar", maxCount: 1 }]);

module.exports = { multer_multi_doc_upload, multer_single_file_upload };
