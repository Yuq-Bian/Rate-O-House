const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const houses = require('../controllers/houses');
const {isLoggedIn} = require('../middleware');

router.route('/')
    .get(catchAsync(houses.index))

router.route('/:id')
    .get(catchAsync(houses.showHouse))
    .post(isLoggedIn)
    
module.exports = router;