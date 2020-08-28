import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

//mostly copied from below.
//https://developers.google.com/calendar/quickstart/nodejs
export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { email },
  } = req;
  const credentials = {
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    client_id: process.env.NEXT_PUBLIC_FIREBASE_AUTH_GOOGLE_WEB_CLIENT_ID,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
  };
  authorize(credentials, getLatestEvent);

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    const accessToken = {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      token_type: "Bearer",
      expiry_date: 1598096466225,
    };
    oAuth2Client.setCredentials(accessToken);
    callback(oAuth2Client);
  }

  async function getLatestEvent(auth) {
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
    if (!events || events.length === 0) {
      res.status(404).json({ error: "no events" });
    }

    const latestEvent = events[events.length - 1];
    res.status(200).json({
      hangoutLink: latestEvent.hangoutLink,
      start: latestEvent.start.dateTime,
    });
  }
};
