const { Schema, model } = require('mongoose');

const slugify = require('slugify');

const wordClassSchema = new Schema({
  partOfSpeech: {
    required: [
      true,
      'A word class must have a partOfSpeech',
    ],
    type: String,
    unique: true,
    enum: {
      values: [
        'verb',
        'verb-2',
        'verb-3',
        'noun',
        'adjective',
        'determiner',
        'adverb',
        'pronoun',
        'preposition',
        'conjunction',
        'interjection',
        'prasal verb',
        'idiom',
        'collocation',
      ],
      message:
        'partOfSpeech is either: /verb/verb-2/verb-3/noun/adjective/determiner/adverb/pronoun/preposition/conjunction/interjection/prasal verb/idiom/collocation',
    },
  },
  slug: String,
  description: {
    required: [
      true,
      'A word class must have a description',
    ],
    type: String,
    trim: true,
    minlength: [
      1,
      'A word spelling must have more or equal than 1 characters',
    ],
    maxlength: [
      150,
      'A word spelling must have less or equal than 90 characters',
    ],
  },
});

// DOCUMENT MIDDLEWARES
wordClassSchema.pre('save', function (next) {
  this.slug = slugify(this.partOfSpeech, {
    lower: true,
  });
  console.log(this.slug);
  next();
});

// QUERY MIDDLEWARES
wordClassSchema.pre('findOneAndUpdate', function (
  next
) {
  const partOfSpeech = this._update.partOfSpeech;
  const additionalUpdates = partOfSpeech
    ? {
        slug: slugify(partOfSpeech, {
          lower: true,
        }),
      }
    : {};

  this.set(additionalUpdates);

  next();
});

const WordClass = model(
  'WordClass',
  wordClassSchema
);

module.exports = WordClass;
