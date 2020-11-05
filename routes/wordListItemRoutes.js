const router = require('express').Router({
  mergeParams: true,
});

const {
  getAllWordListItems,
  createWordListItem,
  getWordListItem,
  updateWordListItem,
  deleteWordListItem,
  uploadUserRecording,
} = require('./../controllers/wordListItemController');

const { protect } = require('./../controllers/authController');

router.use(protect);

console.log(getAllWordListItems);
router
  .route('/')
  .get(getAllWordListItems)
  .post(uploadUserRecording, createWordListItem);

router
  .route('/:id')
  .get(getWordListItem)
  .patch(uploadUserRecording, updateWordListItem)
  .delete(deleteWordListItem);

module.exports = router;
