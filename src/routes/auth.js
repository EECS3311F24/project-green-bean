const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch"); // Ensure node-fetch is available

// Helper function to fetch user data from Google API
async function getUserData(access_token) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

// Generate OAuth URL
router.post("/google", async (req, res) => {
  try {
    const redirectUrl = "http://localhost:3001/api/auth/callback"; // Updated to the callback route

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const authorizedUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
      prompt: "consent",
    });

    console.log(authorizedUrl);
    res.json({ url: authorizedUrl });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch URL from Google",
      error: error.message,
    });
  }
});

// OAuth callback handling
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const redirectUrl = "http://localhost:3001/api/auth/callback";

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const response = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(response.tokens);

    const user = oAuth2Client.credentials;

    const userData = await getUserData(user.access_token);
    if (!code || !userData) {
      return res.status(400).json({
        message: "Code and userData are required",
      });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to sign in with Google",
      error: error.message,
    });
  }
});

module.exports = router;
