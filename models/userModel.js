const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      trim: true,
      maxlength: [100, 'Your name must have less or equal than 150 characters'],
      minlength: [1, 'Your name must have more or equal than 1 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email!'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user', 'contributor'],
      },
      default: 'user',
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Please provide a password'],
      trim: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide a passwordConfirm'],
      trim: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: `Passwords are not the same!`,
      },
    },
    photo: {
      type: String,
      default: 'default.jpeg',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('wordLists', {
  ref: 'WordList',
  localField: '_id',
  foreignField: 'user',
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }).populate('wordLists');
  next();
});

userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

userSchema.methods.changedPasswordAfter = function (initialJWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedPasswordTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );

    return changedPasswordTimestamp > initialJWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, { hashedResetToken: this.passwordResetToken });
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model('User', userSchema);

module.exports = User;
