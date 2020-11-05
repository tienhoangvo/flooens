const { Schema, model } = require('mongoose');
const wordListItemSchema = new Schema({
  wordList: {
    type: Schema.Types.ObjectId,
    ref: 'WordList',
    required: [
      true,
      'A wordListItem must have a wordList',
    ],
  },
  word: {
    type: String,
    required: [
      true,
      'A wordListItem must have a word',
    ],
  },
  wordClass: String,
  pronunciations: Array,
  recording: String,
  userDefinition: {
    type: String,
    trim: true,
    minlength: [
      5,
      'A word spelling must have more or equal than 5 characters',
    ],
    maxlength: [
      150,
      'A word spelling must have less or equal than 150 characters',
    ],
  },
  userExample: {
    type: String,
    trim: true,
    require: [true, 'Please provide an example'],
    minlength: [
      5,
      'An example must have more or equal than 5 characters',
    ],
    maxlength: [
      200,
      'An example must have less or equal than 150 characters',
    ],
  },
  image: String,
  definition: {
    type: Schema.Types.ObjectId,
    ref: 'Definition',
    validate: {
      validator: function (value) {
        return this.userDefinition || value;
      },
      message: 'Please define a definition',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

wordListItemSchema.index(
  { wordList: 1, definition: 1 },
  { unique: true }
);

wordListItemSchema.index({
  word: 'text',
});

wordListItemSchema.pre(/^find/, function (next) {
  this.populate(
    'definition',
    'definition examples'
  );
  next();
});

const WordListItem = model(
  'WordListItem',
  wordListItemSchema
);

module.exports = WordListItem;
