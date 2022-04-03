const mongoose = require('mongoose');
const House = require('../models/house');
const data = require('./MockData');

mongoose.connect('mongodb://127.0.0.1:27017/rate-house')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const homes = data.payload.homes;
const homesNum = homes.length;

const seedDB = async () => {
    await House.deleteMany({});
    for (let i = 0; i < homesNum; i++) {
        const mlsId = homes[i].mlsId.value;
        const shortPartitionId = mlsId.substring(mlsId.length - 3);
        const photoId = (homes[i].photos.value.split(',')[0]).split(':')[1];
        const imgUrl = `https://ssl.cdn-redfin.com/photo/${homes[i].photos.level}/bigphoto/${shortPartitionId}/${mlsId}_${photoId}.jpg`;
        const house = new House({
            id: homes[i].listingId,
            streetLine: `${homes[i].streetLine.value}`,
            location: `${homes[i].location.value}`,
            city: `${homes[i].city}`,
            state: `${homes[i].state}`,
            zip: `${homes[i].zip}`,
            price: homes[i].price.value,
            sqFt: homes[i].sqFt.value,
            beds: homes[i].beds,
            baths: homes[i].baths,
            yearBuilt: homes[i].yearBuilt.value,
            description: homes[i].listingRemarks,
            redfinURL: `https://www.redfin.com${homes[i].url}`,
            geometry: {
                type: "Point",
                coordinates: [
                    homes[i].latLong.value.longitude,
                    homes[i].latLong.value.latitude,
                ]
            },
            images: [
                {
                    url: imgUrl,
                    filename: 'img'
                }
            ]
        })
        await house.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})