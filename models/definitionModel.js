const { Schema, model } = require('mongoose');

const definitionSchema = new Schema({
  wordSense: {
    type: Schema.Types.ObjectId,
    ref: 'WordSense',
    required: [
      true,
      'A definition must belong to wordSense',
    ],
  },
  definition: {
    type: String,
    trim: true,
    minlength: [
      5,
      'A word spelling must have more or equal than 5 characters',
    ],
    maxlength: [
      300,
      'A word spelling must have less or equal than 300 characters',
    ],
  },
  image: String,
  examples: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Example',
    },
  ],
});

definitionSchema.index({ definition: 'text' });

// QUERY MIDDLEWARES
definitionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'examples',
    select: 'example',
  });
  next();
});

const Definition = model(
  'Definition',
  definitionSchema
);

module.exports = Definition;
