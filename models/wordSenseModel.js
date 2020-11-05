const { Schema, model } = require('mongoose');

const wordSenseSchema = new Schema(
  {
    wordForm: {
      type: Schema.Types.ObjectId,
      ref: 'WordForm',
      required: [
        true,
        'A wordSense must belong to a wordForm',
      ],
    },
    guideWord: {
      type: String,
      trim: true,
      minlength: [
        2,
        'A guide word must have more or equal than 2 characters',
      ],
      maxlength: [
        100,
        'A guide word must have less or equal than 100 characters',
      ],
      default: 'general',
      required: [
        true,
        'A wordSense must have a guideWord!',
      ],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

wordSenseSchema.index(
  { guideWord: 1, wordForm: 1 },
  { unique: true }
);
wordSenseSchema.virtual('definitions', {
  ref: 'Definition',
  localField: '_id',
  foreignField: 'wordSense',
});

wordSenseSchema.pre(/^find/, function (next) {
  this.populate(
    'definitions',
    'definition examples'
  );
  next();
});

const WordSense = model(
  'WordSense',
  wordSenseSchema
);

module.exports = WordSense;
