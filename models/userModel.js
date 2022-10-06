const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersSchema = new mongoose.Schema({
  uid: String,
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      40,
      'A user name must have less than or equal to 40 characters',
    ],
    minLength: [4, 'A user name must have more than or equal to 8 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: [true, 'A user must have a unique email'],
    trim: true, // Remove all the white space in the beginning or end of the field
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    //required: [true, 'A user must have a password'],
    maxLength: [
      40,
      'A user password must have less than or equal to 40 characters',
    ],
    minLength: [
      8,
      'A user password must have more than or equal to 8 characters',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    //required: [true, 'A user must have a password cofirm'],
    maxLength: [
      40,
      'A user password confirm must have less than or equal to 40 characters',
    ],
    minLength: [
      8,
      'A user password confirm must have more than or equal to 8 characters',
    ],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password Confirm must be equal to your password',
    },
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: 1,
    select: false,
  },
  token: String,
});

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // subtract 1 second to be older than the date of giving the token
  next();
});

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // We use passwordConfirm only to check that tge user didn't input different passwords then we don't need this
  next();
});

usersSchema.pre(/^find/, async function (next) {
  // this poinst to current query
  this.find({ isActive: { $ne: false } });
  next();
});

usersSchema.methods.correctPassword = async function (candidate, real) {
  return await bcrypt.compare(candidate, real);
};

usersSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt)
    return parseInt(this.passwordChangedAt.getTime() / 1000) > JWTTimestamp;
  return 0;
};

usersSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes with millis
  return resetToken;
};

const User = mongoose.model('User', usersSchema); // This will create collection called 'users'

module.exports = User;
