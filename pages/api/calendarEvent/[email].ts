import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { google } from "googleapis";
import readline from "readline";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { email },
  } = req;
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  const TOKEN_PATH = "token.json";
  const credentials = {
    web: {
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      client_id: process.env.NEXT_PUBLIC_FIREBASE_AUTH_GOOGLE_WEB_CLIENT_ID,
      redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
    },
  };
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(credentials, listEvents);

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    console.log(credentials);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    console.log(client_secret, client_id, redirect_uris);
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, null, (err, token: string) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });

    if (typeof email !== "string") {
      res.status(404).json({ error: "invalid email" });
      return;
    }
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      q: email,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items.filter(
      (event) => event.attendees[0].responseStatus === "accepted"
    );
    if (!events.length || events.length === 0) {
      res.status(404).json({ error: "no events" });
    }

    const latestEvent = events[events.length - 1];
    res.status(200).json({
      hangoutLink: latestEvent.hangoutLink,
      start: latestEvent.start.dateTime,
    });
  }
};
