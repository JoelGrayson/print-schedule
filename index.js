// Most code from https://developers.google.com/calendar/api/quickstart/nodejs

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const jdate=require('joeldate');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


async function listEvents(auth) {
    const calendar=google.calendar({version: 'v3', auth});

    const maxChars=45;
    function chopTo(str, length) {
        if (str.length>length-1)
            return str.slice(0, length)+'…';
        else
            return str;
    }
    function formatLine(str, filler='-', align='center') {
        return '|'+filler+(align==='center' ? centerAlign : leftAlign)(chopTo(str, maxChars), filler=filler)+filler+'|'+'\n';
    }
    function centerAlign(str, filler='-') {
        let padStart=(maxChars-str.length)/2;
        let padEnd=padStart;
        if (padStart%1===0.5 && padStart>1) {
            padStart+=0.5;
            padEnd-=0.5;
        }
        return filler.repeat(padStart)+str+filler.repeat(padEnd);
    }
    function leftAlign(str, filler='-') {
        return str+filler.repeat(maxChars-str.length);
    }
    let message=formatLine(`Schedule for ${jdate()}`);
    message+=formatLine('', ' ');
    const res=await calendar.events.list({
        calendarId: 'primary',
        timeMin: (()=>{
            const date=new Date();
            date.setHours(0);
            date.setMinutes(0);
            return date.toISOString();
        })(),
        timeMax: (()=>{
            const date=new Date();
            date.setHours(23);
            date.setMinutes(59);
            return date.toISOString();
        })(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    events.map((event, i) => {
        const start=new Date(event.start.dateTime || event.start.date);
        const end=new Date(event.end.dateTime || event.end.date);
        let formattedStart=`${start.getHours()}:${('0'+start.getMinutes()).slice(-2)}`;
        let formattedEnd=`${end.getHours()}:${('0'+end.getMinutes()).slice(-2)}`;
        // message+=formatLine(formattedStart+' - '+chopTo(event.summary, maxChars-4)+' - '+formattedEnd, ' ', 'left');
        const middleLength=maxChars-4 /*pipe and space*/ -8*2/* time and hyphen on both sides */+2/*adjusting, not sure why*/;
        message+=formatLine(formattedStart.padStart(5, ' ')+' - '+chopTo(event.summary, middleLength).padEnd(middleLength+1/*for …*/)+' - '+formattedEnd.padEnd(5, ' '), ' ', 'left');
    });
    message+=formatLine('', ' ');
    message+=formatLine('');
    console.log(message);
}

function main() {
  authorize()
    .then(listEvents)
    .catch(console.error);
}

main();
