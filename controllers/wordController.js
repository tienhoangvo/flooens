const Word = require('../models/wordModel');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllWords = getAll(Word);

exports.createWord = createOne(Word);

exports.getWord = getOne(Word, 'wordEntries');

exports.updateWord = updateOne(Word);

exports.deleteWord = deleteOne(Word);
