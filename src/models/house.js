const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const HouseSchema = new Schema({
    id: Number,
    streetLine:String,
    location: String,
    city: String,
    state: String,
    zip: String,
    price: Number,
    sqFt: Number,
    beds: Number,
    baths: Number,
    yearBuilt: Number,
    description: String,
    redfinURL: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HouseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

HouseSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/houses/${this._id}">$${this.price} ${this.location}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`
});

module.exports = mongoose.model('House', HouseSchema);