const multer = require('multer');
const sharp = require('sharp');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Definition = require('../models/definitionModel');
const Example = require('./../models/exampleModel');
const {
  getAll,
  getOne,
  deleteOne,
} = require('./../controllers/handlerFactory');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/'))
    return cb(
      new AppError(
        'The photo file is not an image.',
        400
      )
    );

  console.log(file);

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5242880 },
});

exports.uploadDefinitionPhoto = upload.single(
  'image'
);
exports.sharpenImage = catchAsync(
  async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `definition-${
      req.params.id
    }-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .jpeg({ quality: 90 })
      .greyscale(true)
      .toFile(
        `${__dirname}/../public/img/definitions/${req.file.filename}`
      );

    next();
  }
);

exports.getAllDefinitions = getAll(Definition, [
  'wordSense',
]);

exports.createDefinition = catchAsync(
  async (req, res, next) => {
    if (req.params && req.params['wordSense'])
      req.body['wordSense'] =
        req.params['wordSense'];

    if (req.file)
      req.body.photo = req.file.filename;

    const definition = await Definition.create(
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: { doc: definition },
    });
  }
);

exports.getDefinition = getOne(Definition);

exports.updateDefinition = catchAsync(
  async (req, res, next) => {
    const filter = { _id: req.params.id };
    if (req.params['wordSense'])
      filter['wordSense'] =
        req.params['wordSense'];

    if (req.file)
      req.body.image = req.file.filename;

    const definition = await Definition.findOneAndUpdate(
      filter,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!definition)
      return next(
        new AppError(
          'No document found with that ID',
          400
        )
      );

    res.status(200).json({
      status: 'success',
      data: { doc: definition },
    });
  }
);
exports.deleteDefinition = deleteOne(Definition);

exports.getAllExamples = catchAsync(
  async (req, res, next) => {
    const {
      examples,
    } = await Definition.findById(
      req.params.id,
      'examples'
    );
    res.status(200).json({
      status: 'success',
      results: examples.length,
      data: { examples },
    });
  }
);

exports.createExample = catchAsync(
  async (req, res, next) => {
    const example = req.body.id
      ? await Example.findById(req.body.id)
      : await Example.create(req.body);
    console.log(example);
    const definition = await Definition.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          examples: example._id,
        },
      },
      { new: true }
    );
    res.status(201).json({
      status: 'success',
      data: { definition },
    });
  }
);

exports.getExample = catchAsync(
  async (req, res, next) => {
    const {
      examples,
    } = await Definition.findById(
      req.params.id,
      'examples -_id'
    );

    const example = examples.find(
      (el) =>
        el._id.toString() === req.params.exampleId
    );

    console.log(example);

    if (!example)
      return next(
        new AppError(
          'There is no example in the current definition with that Id',
          404
        )
      );
    res.status(200).json({
      status: 'success',
      data: { example },
    });
  }
);

exports.deleteExample = catchAsync(
  async (req, res, next) => {
    const definition = await Definition.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          examples: req.params.exampleId,
        },
      },
      {
        new: true,
      }
    );

    console.log(definition);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.getDefinitionStats = catchAsync(
  async (req, res, next) => {
    const definitionStats = await Definition.aggregate(
      [
        {
          $group: {
            _id: '$word',
            definitionQuantity: { $sum: 1 },
          },
        },
      ]
    );

    res.status(200).json({
      status: 'success',
      data: definitionStats,
    });
  }
);
