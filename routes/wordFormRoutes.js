const router = require('express').Router({
  mergeParams: true,
});

const wordSenseRouter = require('./wordSenseRoutes');
const pronunciationsRouter = require('./pronunciationRoutes');
router.use('/:wordForm/wordSenses', wordSenseRouter);

router.use('/:wordForm/pronunciations', pronunciationsRouter);

const {
  getAllWordForms,
  createWordForm,
  getWordForm,
  updateWordForm,
  deleteWordForm,
} = require('../controllers/wordFormController');

const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getAllWordForms)
  .post(protect, restrictTo('admin', 'contributor'), createWordForm);

router
  .route('/:id')
  .get(getWordForm)
  .patch(protect, restrictTo('admin', 'contributor'), updateWordForm)
  .delete(protect, restrictTo('admin', 'contributor'), deleteWordForm);

module.exports = router;
