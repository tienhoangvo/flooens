const router = require('express').Router({
  mergeParams: true,
});

const {
  getAllPronunciations,
  createPronunciation,
  getPronunciation,
  updatePronunciation,
  deletePronunciation,
  uploadPronunciationSound,
} = require('./../controllers/pronunciationController');

const {
  restrictTo,
  protect,
} = require('./../controllers/authController');

router
  .route('/')
  .get(getAllPronunciations)
  .post(
    protect,
    restrictTo('admin', 'contributor'),
    uploadPronunciationSound,
    createPronunciation
  );

router
  .route('/:id')
  .get(getPronunciation)
  .patch(
    protect,
    restrictTo('admin', 'contributor'),
    uploadPronunciationSound,
    updatePronunciation
  )
  .delete(
    protect,
    restrictTo('admin', 'contributor'),
    deletePronunciation
  );

module.exports = router;
