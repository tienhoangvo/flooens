const router = require('express').Router({
  mergeParams: true,
});

const exampleRouter = require('./../routes/exampleRoutes');
const { protect, restrictTo } = require('./../controllers/authController');

const {
  getAllDefinitions,
  createDefinition,
  getDefinition,
  updateDefinition,
  deleteDefinition,
  getDefinitionStats,
  getAllExamples,
  createExample,
  getExample,
  deleteExample,
  uploadDefinitionPhoto,
  sharpenImage,
} = require('../controllers/definitionController');

router
  .route('/:id/examples')
  .get(getAllExamples)
  .post(protect, restrictTo('admin', 'contributor'), createExample);

router
  .route('/:id/examples/:exampleId')
  .get(getExample)
  .delete(protect, restrictTo('admin', 'contributor'), deleteExample);

router.use('/:definition/examples/', exampleRouter);

router.get('/stats', protect, restrictTo('admin'), getDefinitionStats);

router
  .route('/')
  .get(getAllDefinitions)
  .post(protect, restrictTo('admin', 'contributor'), createDefinition);

router
  .route('/:id')
  .get(getDefinition)
  .patch(
    protect,
    restrictTo('admin', 'contributor'),
    uploadDefinitionPhoto,
    sharpenImage,
    updateDefinition
  )
  .delete(protect, restrictTo('admin', 'contributor'), deleteDefinition);

module.exports = router;
