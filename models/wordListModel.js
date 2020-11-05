const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const wordListSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        'A wordList must belong to a user!',
      ],
    },
    name: {
      type: String,
      required: [
        true,
        'A wordList must have a name',
      ],
      trim: true,
      maxlength: [
        150,
        'A wordList must have less or equal than 150 characters',
      ],
      minlength: [
        1,
        'A wordList must have more or equal than 1 characters',
      ],
    },

    slug: String,
    description: {
      type: String,
      trim: true,
      minlength: [
        1,
        'A wordList description must have more or equal than 1 characters',
      ],
      maxlength: [
        300,
        'A wordList description must have less or equal than 300 characters',
      ],
    },

    public: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

wordListSchema.index(
  { user: 1, name: 1 },
  { unique: true }
);

wordListSchema.index({
  name: 'text',
});

wordListSchema.index({ user: 1 });

// VIRTUAL POPULATIONS
wordListSchema.virtual('wordListItems', {
  ref: 'WordListItem',
  localField: '_id',
  foreignField: 'wordList',
});

// QUERY MIDDLEWARES
wordListSchema.pre(/^find/, function (next) {
  this.populate('wordListItems');
  next();
});

wordListSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  console.log(this.slug);
  next();
});

wordListSchema.pre('findOneAndUpdate', function (
  next
) {
  const additionalUpdates = this._update.name
    ? {
        slug: slugify(this._update.name, {
          lower: true,
        }),
      }
    : {};
  this.set(additionalUpdates);
  next();
});

wordListSchema.virtual('wordListItems', {
  ref: 'WordListItem',
  localField: '_id',
  foreignField: 'wordList',
});

const WordList = model(
  'WordList',
  wordListSchema
);

module.exports = WordList;
