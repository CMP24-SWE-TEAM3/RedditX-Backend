const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      required: [true, 'Review can not be without rating!'],
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewsSchema.pre(/^find/, function (next) {
  /* this.populate({
    path: 'user',
    select: 'name photo',
  }) // populate makes the query that brings documents of users into guides field, so it will look like embedded users in it each time you query
    .populate({
      path: 'tour',
      select: 'name',
    }); */
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
/*reviewsSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${(Date.now() - this.start) / 1000} seconds!`); // this points to query object
  next();
});*/

reviewsSchema.statics.calcRatingsAverage = async function (tourId) {
  const stats = await this.aggregate([
    // this points to the model itself because it is a static middleware
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true }); // make this combination unique

reviewsSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone(); // passing the wanted document to next middlewares
  next();
});

reviewsSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcRatingsAverage(this.r.tour);
});

reviewsSchema.post('save', async function () {
  await this.constructor.calcRatingsAverage(this.tour);
});

const Review = mongoose.model('Review', reviewsSchema); // This will create collection called 'tours'

module.exports = Review;
