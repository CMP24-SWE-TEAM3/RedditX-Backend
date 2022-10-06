const express = require('express');
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });
// merge params because we want the tourId from params in tours routes

router.get(
  '/',
  //bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
