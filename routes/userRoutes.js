const router = require('express').Router();
const wordListRouter = require('./wordListRoutes');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  redirectCurrentUserUrlById,
  uploadUserPhoto,
  sharpenImage,
} = require('./../controllers/userController');

const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require('./../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.use(protect);
router.get('/logout', logout);
router.patch('/updateMyPassword', updatePassword);
router
  .route('/me/wordLists')
  .get(redirectCurrentUserUrlById)
  .post(redirectCurrentUserUrlById);
router
  .route('/me/wordLists/:wordList')
  .get(redirectCurrentUserUrlById)
  .patch(redirectCurrentUserUrlById)
  .delete(redirectCurrentUserUrlById);

router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, sharpenImage, updateMe);
router.delete('/deleteMe', deleteMe);

router.use('/:user/wordLists', wordListRouter);

router
  .route('/')
  .get(restrictTo('admin'), getAllUsers)
  .post(restrictTo('admin'), createUser);

router
  .route('/:id')
  .get(restrictTo('admin'), getUser)
  .patch(restrictTo('admin'), updateUser)
  .delete(restrictTo('admin'), deleteUser);

module.exports = router;
