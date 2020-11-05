const Example = require('../models/exampleModel');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllExamples = getAll(Example);

exports.createExample = createOne(Example);

exports.getExample = getOne(Example);

exports.updateExample = updateOne(Example);

exports.deleteExample = deleteOne(Example);
