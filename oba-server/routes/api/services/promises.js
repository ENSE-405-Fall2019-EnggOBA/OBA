const passport = require("passport");

function passport_auth(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (user) resolve(user);
      else reject(err ? err : info);
    })(req, res, next);
  });
}

function upload_file(multer_upload_sig, req, res) {
  return new Promise((resolve, reject) => {
    multer_upload_sig(req, res, err => {
      if (err !== undefined) return reject(err);
      resolve(req.files);
    });
  });
}

module.exports = { passport_auth, upload_file };
