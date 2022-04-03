const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        ratingDaylight: Joi.number().required().min(1).max(5),
        ratingQuietness: Joi.number().required().min(1).max(5),
        ratingPrice: Joi.number().required().min(1).max(5),
        ratingInterior: Joi.number().required().min(1).max(5),
        ratingViews: Joi.number().required().min(1).max(5),
        ratingPlan: Joi.number().required().min(1).max(5),
        ratingCommunity: Joi.number().required().min(1).max(5),
        ratingDefect: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

