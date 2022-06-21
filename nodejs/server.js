require('dotenv').config({path: '.env'});
const express = require('express');

const twilio = require('twilio');
const ngrok = require('ngrok');
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const app = express();

app.get('/getToken', (req, res) => {
  if (!req.query || !req.query.userName) {
    return res.status(400).send('Username parameter is required');
  }
  const accessToken = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY_SID,
    process.env.API_KEY_SECRET,
  );

  // Set the Identity of this token
  accessToken.identity = req.query.userName;

  // Grant access to Video
  var grant = new VideoGrant();
  accessToken.addGrant(grant);

  // Serialize the token as a JWT
  var jwt = accessToken.toJwt();
  return res.send(jwt);
});

app.get('/AudioCall', (req, res) => {
  client.video.rooms
    .create({
      audioOnly: true,
      uniqueName: 'Audio-Only Call',
      type: 'group',
    })
    .then(room => {
      console.log(room);
      res.send(room.sid);
    });
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}!`),
);

ngrok.connect(process.env.PORT).then(url => {
  console.log(`Server forwarded to public url ${url}`);
});
