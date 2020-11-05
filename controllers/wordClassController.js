const WordClass = require('./../models/wordClassModel');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllWordClasses = getAll(WordClass);

exports.createWordClass = createOne(WordClass);

exports.getWordClass = getOne(WordClass);

exports.updateWordClass = updateOne(WordClass);

exports.deleteWordClass = deleteOne(WordClass);
