const path= require('path')
const multer = require("multer");
const chmod = require('chmod')


exports.formatBytes = function (a, b = 2) {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
};
exports.generateRandomString = function (length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// upload utils
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../../public/uploads/temp/`));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      encodeURIComponent(
        `${file.fieldname}-${Date.now()}-${exports.generateRandomString(
          25
        )}${path.extname(file.originalname)}`
      )
    );
  },
});
const fileFilter = (req, file, cb, res) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    console.log(res);
    cb(
      {
        error: 1,
        code: 1002,
        message: "Invalid File Type",
      },
      false
    );
  }
};
exports.uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, //2mb
  },
  fileFilter: fileFilter,
});

exports.uploadErrorHandlers = (req,res,e)=>{
    if(e){
        if(e.code == 'LIMIT_FILE_SIZE') return res.status(400).send({
            "error": 1,
            "code": 1003,
            "message": "File Is Too Large. Max Allowed File Size Is 2MB"
        })
        else if(e.code === 1002) return res.status(400).send(e)
        else return res.status(400).send({
            "error": 1,
            "code": 1999,
            "message": "unknown error occured",
            e
        })
    }
    chmod(req.file.path, 666)
    return res.json({status: 'done',info: {
        uploadedOrignalFileName:  req.file.originalname,
        uploadedFileType: req.file.mimetype,
        size: exports.formatBytes(req.file.size),
        path: req.file
    }})
}

exports.uploadSingleImage = exports.uploadFile.single('image');
exports.uploadSingleDocument = exports.uploadFile.single('document');

module.exports = exports;