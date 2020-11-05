const WordList = require('../models/wordListModel');
const {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllWordLists = getAll(WordList, ['user']);

exports.createWordList = createOne(WordList, ['user']);

exports.getWordList = getOne(WordList, 'wordListItems', ['user']);

exports.updateWordList = updateOne(WordList, ['user']);

exports.deleteWordList = deleteOne(WordList, ['user']);
