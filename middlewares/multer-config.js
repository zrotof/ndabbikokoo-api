const multer = require('multer');

//Extensions de fichiers autorisées
const FILE_TYPE_MAP = {
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'jpeg',
  'image/webp':'webp'
}

const filefilter = (req, file, cb) => {
  if (FILE_TYPE_MAP[file.mimetype]){
      cb(null, true)
  } else {
      cb(null, false)
  }
}

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
      cb(null, '')
  }
})

const uploadOptions = multer({ storage: storage, fileFilter: filefilter })

module.exports = uploadOptions;