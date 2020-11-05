const WordSense = require('./../models/wordSenseModel');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllWordSenses = getAll(WordSense, [
  'wordForm',
]);
exports.createWordSense = createOne(WordSense);

exports.getWordSense = getOne(WordSense);
exports.updateWordSense = updateOne(WordSense);
exports.deleteWordSense = deleteOne(WordSense);
