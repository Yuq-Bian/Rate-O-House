const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.post('/', isLoggedIn, upload.array('image'), validateReview, catchAsync(reviews.createReview))

router.route('/:reviewId')
.delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
.put(isLoggedIn, isReviewAuthor, upload.array('image'), validateReview, catchAsync(reviews.updateReview))

router.get('/:reviewId/edit', isLoggedIn, isReviewAuthor, catchAsync(reviews.renderEditForm))

module.exports = router;