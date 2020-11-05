const { Schema, model } = require('mongoose');

const pronunciationSchema = new Schema(
  {
    wordForm: {
      type: Schema.Types.ObjectId,
      ref: 'WordForm',
      required: [
        true,
        'A pronunciation must belong to a wordForm',
      ],
    },
    accent: {
      type: String,
      enum: {
        values: ['US', 'UK', 'AUS'],
        message:
          'Accent must be either US/UK/AUS!',
      },
    },
    sound: String,
    IPA: {
      type: String,
      minlength: [
        1,
        'A pronunciation IPA must have more or equal than 1 character',
      ],
      maxlength: [
        100,
        'A pronunciation IPA must have less or equal than 100',
      ],
      require: [
        true,
        'A pronunciation must have an IPA',
      ],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

pronunciationSchema.index(
  { wordForm: 1, accent: 1 },
  { unique: true }
);

const Pronunciation = model(
  'Pronunciation',
  pronunciationSchema
);

module.exports = Pronunciation;
