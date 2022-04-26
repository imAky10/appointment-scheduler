const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const fromPhone = process.env.TWILIO_PHONE;
const toPhone = process.env.TEXT_PHONE;

const app = express();
const PORT = 5000;

// this application will receive JSON data
app.use(bodyParser.json());

// start the server on port 3100
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

const client = require("twilio")(accountSid, authToken);

app.post("/webhook", (req, res) => {
  const activity = req.body.activity;
  const message = `💰🚀 ${activity[0].fromAddress} paid you ${activity[0].value} ETH. View on etherscan https://ropsten.etherscan.io/tx/${activity[0].hash} 💰🚀`;
  client.messages
    .create({
      body: message,
      from: fromPhone,
      to: toPhone,
    })
    .then((message) => console.log(message.sid));

  res.status(200).end();
});

function isValidSignature(request) {
  const token = process.env.ALCHEMY_SIGNING_KEY;
  const headers = request.headers;
  const signature = headers["x-alchemy-signature"]; // Lowercase for NodeJS
  const body = request.body;
  const hmac = crypto.createHmac("sha256", token); // Create a HMAC SHA256 hash using the auth token
  hmac.update(JSON.stringify(body), "utf8"); // Update the token hash with the request body using utf8
  const digest = hmac.digest("hex");
  return signature === digest; // If signature equals your computed hash, return true
}
