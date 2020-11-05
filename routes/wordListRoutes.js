const router = require('express').Router({
  mergeParams: true,
});

const wordListItemRouter = require('./wordListItemRoutes');

const {
  getAllWordLists,
  createWordList,
  getWordList,
  updateWordList,
  deleteWordList,
} = require('./../controllers/wordListController');

const { protect } = require('./../controllers/authController');

router.use(protect);

router.use('/:wordList/wordListItems', wordListItemRouter);

router.route('/').get(getAllWordLists).post(createWordList);

router
  .route('/:id')
  .get(getWordList)
  .patch(updateWordList)
  .delete(deleteWordList);

module.exports = router;
