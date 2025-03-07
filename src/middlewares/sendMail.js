import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false,
    auth: {
        // user: `${process.env.NODE_CODE_SENDING_EMAIL_ADDRESS}`,
        user: "shiv.test.dev@gmail.com",
        pass: `${process.env.NODE_CODE_SENDING_EMAIL_PASSWORD}`,
        // pass: "fwoymxtkdxjppici",
    },
    // connectionTimeout: 10000,
    // greetingTimeout: 10000,
    // socketTimeout: 10000
});

export { transport };
