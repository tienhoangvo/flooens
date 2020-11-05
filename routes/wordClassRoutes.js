const express = require('express');

const router = express.Router();

const {
  getAllWordClasses,
  createWordClass,
  getWordClass,
  updateWordClass,
  deleteWordClass,
} = require('./../controllers/wordClassController');

const { protect, restrictTo } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllWordClasses)
  .post(protect, restrictTo('admin', 'contributor'), createWordClass);

router
  .route('/:id')
  .get(getWordClass)
  .patch(protect, restrictTo('admin', 'contributor'), updateWordClass)
  .delete(protect, restrictTo('admin', 'contributor'), deleteWordClass);

module.exports = router;
