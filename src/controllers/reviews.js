const House = require('../models/house');
const Review = require('../models/review');
const { cloudinary } = require("../cloudinary");

module.exports.createReview = async (req, res) => {
    
    const house = await House.findById(req.params.id);
    const review = new Review(req.body.review);
    review.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    review.author = req.user._id;
    house.reviews.push(review);
    await review.save();
    await house.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/houses/${house._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await House.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findById(reviewId);
    for( let img of review.images){
        await cloudinary.uploader.destroy(img.filename);
    }
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/houses/${id}`);
}

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    review.images.push(...imgs);
    await review.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await review.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated review!');
    res.redirect(`/houses/${id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const { id, reviewId } = req.params;
    const house = await House.findById(id)
    const review = await Review.findById(reviewId)
    if (!review) {
        req.flash('error', 'Cannot find that review!');
        return res.redirect(`/houses/${id}`);
    }
    res.render('houses/edit', { house, review });
}