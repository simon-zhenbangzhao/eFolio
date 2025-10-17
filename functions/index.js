const { onRequest } = require('firebase-functions/v2/https')
const { defineString } = require('firebase-functions/params')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const nodemailer = require('nodemailer')

// Define email configuration parameters
const emailUser = defineString('EMAIL_USER', { default: 'xay2001skr@gmail.com' })
const emailPassword = defineString('EMAIL_PASSWORD')

admin.initializeApp()

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection('books')
      const snapshot = await booksCollection.get()
      const count = snapshot.size

      res.status(200).json({ count: count })
    } catch (error) {
      console.error('Error counting books:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// Email sending function using Nodemailer
exports.sendEmail = onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const { to, subject, text, html, attachments } = req.body

      // Validate required fields
      if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ error: 'Missing required fields: to, subject, and text/html' })
      }

      // Create transporter using Gmail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser.value(),
          pass: emailPassword.value()
        }
      })

      // Email options
      const mailOptions = {
        from: emailUser.value(),
        to: to,
        subject: subject,
        text: text,
        html: html || text
      }

      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        mailOptions.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          encoding: 'base64'
        }))
      }

      // Send email
      const info = await transporter.sendMail(mailOptions)

      console.log('Email sent:', info.messageId)
      res.status(200).json({ 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully'
      })
    } catch (error) {
      console.error('Error sending email:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

