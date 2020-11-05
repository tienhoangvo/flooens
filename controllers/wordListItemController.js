const multer = require('multer');
const WordListItem = require('./../models/wordListItemModel');
const {
  getAll,
  getOne,
  deleteOne,
} = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/sounds/users/');
  },

  filename: (req, file, cb) => {
    const ext = 'mp3';
    const fileName = `user-${
      req.user.id
    }-${Date.now()}.${ext}`;
    console.log(fileName);
    cb(null, fileName);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('audio/'))
    return cb(
      new AppError(
        'The files must be imagery or audiotory',
        400
      )
    );

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5242880 },
});

exports.uploadUserRecording = upload.single(
  'recording'
);

exports.getAllWordListItems = getAll(
  WordListItem,
  ['wordList']
);

exports.createWordListItem = catchAsync(
  async (req, res, next) => {
    console.log({ params: req.params });
    if (req.params && req.params['wordList']) {
      req.body['wordList'] =
        req.params['wordList'];
    }

    console.log(req.body);

    if (req.params && req.params['definition']) {
      req.body['definition'] =
        req.params['definition'];
    }

    if (req.file)
      req.body.recording = req.file.filename;

    const wordListItem = await WordListItem.create(
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: { wordListItem },
    });
  }
);

exports.getWordListItem = getOne(
  WordListItem,
  'definition',
  ['wordList', 'definition']
);

exports.updateWordListItem = catchAsync(
  async (req, res, next) => {
    if (req.file)
      req.body.recording = req.file.filename;
    console.log(req.body);

    const queryOptions = { _id: req.params.id };
    if (req.params && req.params.wordList)
      queryOptions.wordList = req.params.wordList;

    if (req.params && req.params.definition)
      queryOptions.definition =
        req.params.definition;

    const wordListItem = await WordListItem.findOneAndUpdate(
      queryOptions,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: { wordListItem },
    });
  }
);

exports.deleteWordListItem = deleteOne(
  WordListItem,
  ['wordList', 'definition']
);
