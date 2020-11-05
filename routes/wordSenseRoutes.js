const router = require('express').Router({
  mergeParams: true,
});

const definitionRouter = require('./definitionRoutes');

router.use('/:wordSense/definitions', definitionRouter);

const {
  getAllWordSenses,
  createWordSense,
  getWordSense,
  updateWordSense,
  deleteWordSense,
} = require('./../controllers/wordSenseController');

router.route('/').get(getAllWordSenses).post(createWordSense);

router
  .route('/:id')
  .get(getWordSense)
  .patch(updateWordSense)
  .delete(deleteWordSense);

module.exports = router;
