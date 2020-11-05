const multer = require('multer');

const WordForm = require('../models/wordFormModel');
const {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllWordForms = getAll(WordForm, [
  'word',
  'wordClass',
]);

exports.createWordForm = createOne(WordForm, [
  'word',
  'wordClass',
]);

exports.getWordForm = getOne(
  WordForm,
  'wordSenses',
  ['word', 'wordClass']
);

exports.updateWordForm = updateOne(WordForm, [
  'word',
  'wordClass',
]);

exports.deleteWordForm = deleteOne(WordForm, [
  'word',
  'wordClass',
]);
