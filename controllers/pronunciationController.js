const multer = require('multer');

const Pronunciation = require('./../models/pronunciationModel');
const {
  getAll,
  getOne,
  deleteOne,
} = require('./../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/sounds/pronunciations/');
  },

  filename: (req, file, cb) => {
    const ext = 'mp3';
    const fileName = `pronunciation-${Date.now()}.${ext}`;
    console.log(fileName);
    cb(null, fileName);
  },
});

const audioFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('audio'))
    return cb(null, true);
  cb(
    new AppError(
      'Not an audio! Please upload only audio',
      400
    ),
    false
  );
};

exports.uploadPronunciationSound = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 5242880 },
}).single('sound');

exports.getAllPronunciations = getAll(
  Pronunciation,
  ['wordForm']
);

exports.createPronunciation = catchAsync(
  async (req, res, next) => {
    if (req.file)
      req.body.sound = req.file.filename;
    if (req.params && req.params.wordSense)
      req.body.wordSense = req.params.wordSense;

    const pronunciation = await Pronunciation.create(
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: { doc: pronunciation },
    });
  }
);

exports.getPronunciation = getOne(
  Pronunciation,
  undefined,
  ['wordForm']
);

exports.updatePronunciation = catchAsync(
  async (req, res, next) => {
    if (req.file)
      req.body.sound = req.file.filename;
    console.log(req.body);

    const queryOptions = { _id: req.params.id };
    if (req.params.wordWorm)
      queryOptions.wordForm = req.params.wordForm;

    const pronunciation = await Pronunciation.findOneAndUpdate(
      queryOptions,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pronunciation)
      return next(
        new AppError(
          'No document found with that Id',
          404
        )
      );

    res.status(200).json({
      status: 'success',
      data: { doc: pronunciation },
    });
  }
);

exports.deletePronunciation = deleteOne(
  Pronunciation,
  ['wordForm']
);
