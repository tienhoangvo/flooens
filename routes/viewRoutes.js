const router = require('express').Router();

const {
  getSearchForm,
  getWord,
  getLoginForm,
  getSignupForm,
  getForgotMyPasswordForm,
  getResetMyPasswordForm,
  getAccount,
  getMyWordLists,
  getMyWordList,
} = require('./../controllers/viewController');

const {
  protect,
  isLoggedIn,
} = require('./../controllers/authController');

router.get(
  '/forgot-my-password/',
  getForgotMyPasswordForm
);

router.get(
  '/reset-my-password/:resetPasswordToken',
  getResetMyPasswordForm
);

router.use(isLoggedIn);
router.get('/', getSearchForm);
router.get('/words/:slug', getWord);
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

router.use(protect);
router.get('/me', getAccount);
router.get('/my-word-lists', getMyWordLists);
router.get('/my-word-lists/:slug', getMyWordList);
// router.get('/my-word-lists', getMyWordLists);
module.exports = router;
