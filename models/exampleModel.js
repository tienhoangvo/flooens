const { Schema, model } = require('mongoose');

const exampleSchema = new Schema({
  example: {
    type: String,
    trim: true,
    require: [true, 'Please provide an example'],
    unique: true,
    minlength: [
      5,
      'An example must have more or equal than 5 characters',
    ],
    maxlength: [
      300,
      'An example must have less or equal than 300 characters',
    ],
  },
  highlights: [
    {
      word: {
        type: String,
        trim: true,
        validate: {
          validator: function (val) {
            return this.example.includes(word);
          },
          message:
            'A highlighted word should be in the example.',
        },
      },
      wordIndex: {
        type: Number,
        validate: {
          validator: function (val) {
            return (
              val < this.example.length &&
              val >= 0
            );
          },
          message:
            'An index of a highlighted word must be less than the length of example and greater or equal than 0',
        },
      },
    },
  ],
});

exampleSchema.index({ example: 'text' });

const Example = model('Example', exampleSchema);

module.exports = Example;
