const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const reviewSchema = new Schema({
    body: String,
    ratingDaylight: Number,
    ratingQuietness: Number,
    ratingPrice: Number,
    ratingInterior: Number,
    ratingViews: Number,
    ratingPlan: Number,
    ratingCommunity: Number,
    ratingDefect: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema]
});

module.exports = mongoose.model("Review", reviewSchema);

