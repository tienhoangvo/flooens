const router = require('express').Router();
const wordFormRouter = require('./wordFormRoutes');

router.use('/:word/wordForms', wordFormRouter);

const {
  getAllWords,
  createWord,
  getWord,
  updateWord,
  deleteWord,
} = require('./../controllers/wordController');

const { protect, restrictTo } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllWords)
  .post(protect, restrictTo('admin', 'contributor'), createWord);

router
  .route('/:id')
  .get(getWord)
  .patch(protect, restrictTo('admin', 'contributor'), updateWord)
  .delete(protect, restrictTo('admin', 'contributor'), deleteWord);

module.exports = router;
