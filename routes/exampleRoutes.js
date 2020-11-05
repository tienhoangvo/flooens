const express = require('express');

const {
  getAllExamples,
  createExample,
  getExample,
  updateExample,
  deleteExample,
} = require('./../controllers/exampleController');

const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(getAllExamples)
  .post(protect, restrictTo('admin', 'contributor'), createExample);

router
  .route('/:id')
  .get(getExample)
  .patch(protect, restrictTo('admin', 'contributor'), updateExample)
  .delete(protect, restrictTo('admin', 'contributor'), deleteExample);

module.exports = router;
