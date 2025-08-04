// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create messages folder if it doesn't exist
const messagesDir = path.join(__dirname, "messages");
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

// Log every incoming request
app.use((req, res, next) => {
  console.log(`⚠️  Request: ${req.method} ${req.url}`);
  next();
});

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "03halfbloodprince@gmail.com",
    pass: "xvwe badj pmnb bgzx", // ✅ App password
  },
});

// Handle form submission
app.post("/submit-form", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${name.replace(/\s+/g, "_")}_${timestamp}.txt`;
  const filepath = path.join(messagesDir, filename);
  const fullMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n`;

  // Save message to file
  fs.writeFile(filepath, fullMessage, (err) => {
    if (err) {
      console.error("❌ Error saving message:", err);
      return res.status(500).json({ success: false, error: "Failed to save message." });
    }

    console.log("✅ Message saved to", filepath);

    // Email details
    const mailOptions = {
      from: "03halfbloodprince@gmail.com",
      to: "03halfbloodprince@gmail.com",
      subject: "📬 New Message from Portfolio",
      text: fullMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
        return res.status(500).json({ success: false, error: "Message saved but email failed." });
      } else {
        console.log("📧 Email sent:", info.response);
        return res.json({ success: true, message: "Message received and email sent!" });
      }
    });
  });
});

// Safe wildcard route: ignores malformed paths like "/:"
app.get(/^\/(?!:).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Optional: 404 fallback for truly unmatched bad routes
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
