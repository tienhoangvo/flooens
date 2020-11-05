const { Schema, model } = require('mongoose');

const wordFormSchema = new Schema(
  {
    word: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: [
        true,
        'A wordForm must belong to a word',
      ],
    },
    wordClass: {
      type: Schema.Types.ObjectId,
      ref: 'WordClass',
      required: [
        true,
        'A wordForm must belong to a wordClass',
      ],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

wordFormSchema.index(
  { word: 1, wordClass: 1 },
  { unique: true }
);

// VIRTUAL POPULATIONS
wordFormSchema.virtual('wordSenses', {
  ref: 'WordSense',
  localField: '_id',
  foreignField: 'wordForm',
});

wordFormSchema.virtual('pronunciations', {
  ref: 'Pronunciation',
  localField: '_id',
  foreignField: 'wordForm',
});

wordFormSchema.pre(/^find/, function (next) {
  this.populate('wordClass').populate(
    'pronunciations wordSenses'
  );
  next();
});

const WordForm = model(
  'WordForm',
  wordFormSchema
);

module.exports = WordForm;
