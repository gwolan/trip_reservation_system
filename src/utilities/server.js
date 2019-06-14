process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/api/form', (req, res) => {
    nodemailer.createTestAccount((err, account) => {
        const htmlEmail = `
            <h3>ZOO WROCŁAW - INFORMACJA W SPRAWIE REZERWACJI</h3>
            <p>${req.body.text}</p>
            Pozdrawiam
        `
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'zoosystemrezerwacji@gmail.com',
                pass: 'projektZespolowy '
            }
        })

        let mailOptions = {
            from: 'zoosystemrezerwacji@gmail.com',
            to: req.body.id,
            subject: 'ZOO WROCŁAW',
            text: req.body.text,
            html: htmlEmail
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err)
            }

            console.log('Message sent: %s', info.message)
            console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
        })
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
