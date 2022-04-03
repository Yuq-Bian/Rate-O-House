const House = require('../models/house');
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
// const { cloudinary } = require("../cloudinary");
const radar = require('svg-radar-chart')
const stringify = require('virtual-dom-stringify')
const smoothing = require('svg-radar-chart/smoothing')




module.exports.index = async (req, res) => {
    const houses = await House.find({})//.populate('popupText');
    res.render('houses/index', { houses })
}

module.exports.showHouse = async (req, res,) => {
    const house = await House.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    if (!house) {
        req.flash('error', 'Cannot find that house!');
        return res.redirect('/houses');
    }
    const ratingTitle = ['Community', 'Floor-Plan', 'Cost-Performance-Ratio','Interior-Decoration','Landscape & Views','Quietness','Daylight','No-Major-Defect'];
    const totalData = [];
    const chartArray = [];

    let totalratingCommunity = 0;
    let totalratingPlan = 0;
    let totalratingPrice = 0;
    let totalratingInterior = 0;
    let totalratingViews = 0;
    let totalratingQuietness = 0;
    let totalratingDaylight = 0;
    let totalratingDefect = 0;

    for (let review of house.reviews) {
        totalratingCommunity += review.ratingCommunity;
        totalratingPlan += review.ratingPlan;
        totalratingPrice += review.ratingPrice;
        totalratingInterior += review.ratingInterior;
        totalratingViews += review.ratingViews;
        totalratingQuietness += review.ratingQuietness;
        totalratingDaylight += review.ratingDaylight;
        totalratingDefect += review.ratingDefect;

        const reviewData = {
            class: "OneReview", price: review.ratingPrice / 5.0,
            interior: review.ratingInterior / 5.0, views: review.ratingViews / 5.0,
            quietness: review.ratingQuietness / 5.0, defect: review.ratingDefect / 5.0,
            daylight: review.ratingDaylight / 5.0, community: review.ratingCommunity / 5.0,
            plan: review.ratingPlan / 5.0
        };
        totalData.push(reviewData);
        const chart = radar({
            // columns
            price: 'Cost-Performance-Ratio',
            interior: 'Interior-Decoration',
            views: 'Landscape & Views',
            quietness: 'Quietness',
            defect: 'No-Major-Defect',
            daylight: 'Daylight',
            community: 'Community',
            plan: 'Floor-Plan',
        }, [reviewData], {
            scales: 5,
            size: 240,
            smoothing: smoothing(.5),
            shapeProps: (data) => ({ className: 'shape ' + data.class }),
            captionProps: () => ({
                className: 'caption',
                textAnchor: 'middle', fontSize: 9,
                fontFamily: 'sans-serif'
            })
        })
        const radarChart = stringify(chart);
        chartArray.push(radarChart);
    }

    const totalChart = radar({
        // columns
        price: 'Cost-Performance-Ratio',
        interior: 'Interior-Decoration',
        views: 'Landscape & Views',
        quietness: 'Quietness',
        defect: 'No-Major-Defect',
        daylight: 'Daylight',
        community: 'Community',
        plan: 'Floor-Plan',
    }, totalData, {
        scales: 5,
        smoothing: smoothing(.7),
        size: 300,
        shapeProps: (data) => ({ className: 'shape ' + data.class }),
        captionProps: () => ({
            className: 'caption',
            textAnchor: 'middle', fontSize: 12,
            fontFamily: 'sans-serif'
        })
    })
    const totalRadarChart = stringify(totalChart);


    const n = house.reviews.length;
    let averageReview = [0, 0, 0, 0, 0, 0, 0, 0];
    if (n > 0) {
        averageReview = [Math.round(totalratingCommunity / n),
        Math.round(totalratingPlan / n),
        Math.round(totalratingPrice / n),
        Math.round(totalratingInterior / n),
        Math.round(totalratingViews / n),
        Math.round(totalratingQuietness / n),
        Math.round(totalratingDaylight / n),
        Math.round(totalratingDefect / n)]
    }

    res.render('houses/show', { house, chartArray, totalRadarChart, averageReview, ratingTitle });
}
