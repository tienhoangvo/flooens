const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const wordSchema = new Schema(
  {
    spelling: {
      type: String,
      unique: true,
      required: [
        true,
        'A WordSpelling must have a spelling.',
      ],
      trim: true,
      minlength: [
        1,
        'A WordSpelling spelling must have more or equal than 1 character',
      ],
      maxlength: [
        50,
        'A WordSpelling spelling must have less or equal than 50 characters',
      ],
    },
    slug: String,
    updatedAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARES
wordSchema.pre('save', function (next) {
  this.slug = slugify(this.spelling, {
    lower: true,
  });
  console.log(this.slug);
  next();
});

// VIRTUAL POPULATIONS
wordSchema.virtual('wordForms', {
  ref: 'WordForm',
  localField: '_id',
  foreignField: 'word',
});

// QUERY MIDDLEWARES
wordSchema.pre(/^findOne/, function (next) {
  this.populate('wordForms').select(
    'spelling slug wordForms'
  );
  next();
});
wordSchema.pre('findOneAndUpdate', function (
  next
) {
  const newSpelling = this._update.spelling;
  const additionalUpdates = newSpelling
    ? {
        updatedAt: Date.now(),
        slug: slugify(newSpelling, {
          lower: true,
        }),
      }
    : { updatedAt: Date.now() };

  this.set(additionalUpdates);

  next();
});

wordSchema.index({ spelling: 'text' });

const Word = model('Word', wordSchema);
module.exports = Word;
