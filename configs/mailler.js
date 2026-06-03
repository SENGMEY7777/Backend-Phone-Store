const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'localhost',
    service: 'gmail',
    auth: {
        user: 'vannsengmey748@gmail.com',
        pass: 'nlcwfvmgdzjdrnkv'
    }
})

module.exports = transporter;
