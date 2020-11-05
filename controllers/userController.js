const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  for (const prop in obj) {
    if (allowedFields.includes(prop))
      newObj[prop] = obj[prop];
  }

  return newObj;
};

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/'))
    return cb(
      new AppError(
        'The photo file is not an image.',
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

exports.uploadUserPhoto = upload.single('photo');
exports.sharpenImage = catchAsync(
  async (req, res, next) => {
    if (!req.file) return next();
    console.log(req.file);
    req.file.filename = `user-${
      req.user.id
    }-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(300, 300)
      .jpeg({ quality: 90 })
      .tint('rgb(234, 255, 112)')
      .toFile(
        `${__dirname}/../public/img/users/${req.file.filename}`
      );
    next();
  }
);

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  console.log('getme', req.params);
  next();
};

exports.updateMe = catchAsync(
  async (req, res, next) => {
    // 1) Check if POSTed body contains the password field or not
    if (
      req.body.password ||
      req.body.passwordConfirm
    )
      return next(
        new AppError(
          'This route is not password updates. Use /updateMyPassword instead!',
          400
        )
      );
    console.log('--USER PHOTO:', req.file);
    if (req.file) {
      req.body.photo = req.file.filename;
    }
    const filteredBody = filterObj(
      req.body,
      'name',
      'email',
      'photo'
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    // 3) Send the new updatedUser to client
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

exports.deleteMe = catchAsync(
  async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.redirectCurrentUserUrlById = (
  req,
  res
) => {
  console.log('HELLO');
  const { url } = req;
  const newUrl = `/api/v1/users${url.replace(
    'me',
    req.user._id
  )}`;

  res.redirect(307, newUrl);
  // return getAllWordLists(req, res, next);
};

exports.getAllUsers = getAll(User);

exports.createUser = createOne(User);

exports.getUser = getOne(User);

exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);
