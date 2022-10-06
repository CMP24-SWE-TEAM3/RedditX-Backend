const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'A tour must have a unique name'],
      trim: true, // Remove all the white space in the beginning or end of the field
      maxLength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minLength: [
        8,
        'A tour name must have more than or equal to 8 characters',
      ],
      /*validate: {
        validator: validator.isAlpha, // error if contains numbers or spaces
        message: 'A tour name must contain only alpha characters',
      },*/
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666 => 46.66666 => 47 => 4.7
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, ' A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount ({VALUE}) must be below the original price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, ' A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // This means, we expect array of numbers
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number], // This means, we expect array of numbers
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
toursSchema.index({ price: 1, ratingsAverage: -1 }); // create an index (sorted list by price then ratingsAverage) which increases speed when the req has a query on price & ratingsAverage
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' }); // Must be an index to make the geospatial queries work
toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // the tour id field in review model
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
toursSchema.pre('save', function (next) {
  //console.log(this); // this: current document
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* toursSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

toursSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
}); */
// QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  // every hook starts with find: find, findOne, ...
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  }); // populate makes the query that brings documents of users into guides field, so it will look like embedded users in it each time you query
  next();
});
toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${(Date.now() - this.start) / 1000} seconds!`); // this points to query object
  next();
});
/* toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift pushes an element to beginning of an array
  console.log(this.pipeline()); //  The array we passed in for tour-stats route
  next();
}); */
const Tour = mongoose.model('Tour', toursSchema); // This will create collection called 'tours'

module.exports = Tour;
