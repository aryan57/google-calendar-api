const { google } = require('googleapis');
const request = require('request');
const keys = require('./service-account.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/calendar']
);

var calendar_ID = ''; //TO BE ADDED
var SHEET_ID = ''; //TO BE ADDED
var TOT_RANGE = 'Sheet1!A:A';
var contest_SITE = 'https://www.kontests.net/api/v1/at_coder';
// var contest_SITE ='https://www.kontests.net/api/v1/codeforces';

client.authorize(function (err, tokens) {

    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log('Connected!');
        check_contests(client);
    }

});

async function check_contests() {

    const timesheet = google.sheets({ version: 'v4', auth: client });

    let received_data = await timesheet.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: TOT_RANGE });
    let actual_data = received_data.data.values;

    var set = new Set();

    if (actual_data != undefined) {
        for (var row of actual_data) {
            for (var cell of row) {
                set.add(cell);
            }
        }
    }

    request(contest_SITE, { json: true }, (err, res, body) => {

        if (err) { return console.log(err); }

        for (var contest of res.body) {
            if (!set.has(contest['name'])) {

                console.log('Unregistered event found! -> %s', contest['name']);

                var cur_event = {
                    'summary': contest['name'],
                    'description': contest['url'],
                    'start': { 'dateTime': contest['start_time'] },
                    'end': { 'dateTime': contest['end_time'] }
                }

                add_event(cur_event);
            }
        }
    });

}

async function add_event(cur_event) {

    const calendar = google.calendar({ version: 'v3', auth: client });
    const contest_name = cur_event['summary'];



    await calendar.events.insert({
        auth: client,
        calendarId: calendar_ID,
        resource: cur_event,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created successfully! -> %s', contest_name);
    });

    add_time(contest_name);

}

async function add_time(contest_name) {

    const timesheet = google.sheets({ version: 'v4', auth: client });
    let values = [[contest_name],];

    const request = {
        spreadsheetId: SHEET_ID,
        range: TOT_RANGE,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values,
        },
        auth: client,
    };
    try {
        const response = (await timesheet.spreadsheets.values.append(request)).data;
        console.log('Timesheet updated sucessfully! -> %s', contest_name);
    } catch (err) {
        console.error(err);
    }
}