const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/api/form', (req, res) => {
    nodemailer.createTestAccount((err, account) => {
        const htmlEmail = `
            <h3>ZOO WROCŁAW - INFO W SPRAWIE REZERWACJI</h3>
            <p><b>${req.body.text}</b></p>
            <p>id rezerwacji: ${req.body.id}</p>
            Pozdrawiam
        `
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'monica8@ethereal.email',
                pass: 'dGSuNadSZ57K2NHRqB'
            }
        })

        let mailOptions = {
            from: 'admin@zoowroc.pl',
            to: 'monica8@ethereal.email',
            subject: 'ZOO WROCŁAW - USUNIETO REZERWACJĘ',
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
