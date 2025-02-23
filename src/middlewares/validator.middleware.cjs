const Joi = require("joi");

const signupSchema = Joi.object({
    // for production
    // email: Joi.string()
    //     .min(2)
    //     .max(60)
    //     .required()
    //     .email({
    //         tlds: { allow: ["com", "net"] },
    //     }),
    // password: Joi.string()
    //     .required()
    //     .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),

    email: Joi.string()
        .min(2)
        .max(60)
        .required()
        .email({
            tlds: { allow: ["com", "net"] },
        }),
    password: Joi.string().required().min(4),
});

const signinSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: { allow: ["com", "net"] },
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

module.exports = { signupSchema, signinSchema };
