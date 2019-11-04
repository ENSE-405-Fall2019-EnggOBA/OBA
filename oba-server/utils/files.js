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
}).fields([
  { name: "exceeds_doc", maxCount: 1 },
  { name: "meets_doc", maxCount: 1 },
  { name: "developing_doc", maxCount: 1 },
  { name: "fail_doc", maxCount: 1 }
]);

function upload_async(multer_upload_sig, req, res) {
  return new Promise(function(resolve, reject) {
    multer_upload_sig(req, res, function(err) {
      if (err !== undefined) return reject(err);
      resolve(req);
    });
  });
}

module.exports = { upload_async, multer_multi_doc_upload };
