This API Google Calendar is made using NodeJS.
I used Google Service Account,Google Calendar API and Google Sheets API for this.

Steps : 
1) Make a project in Google Cloud.
2) Add Google Calendar API and Google Sheets API in the project
3) Create a google service account for the project
4) Download the key of Service Account in JSON format and save it in the project folder as 'service-account.json' .
5) Share the Google Calendar with the  service account email id with edit access for the calendar.
6) Share the Google Sheet with the service account email id with edit access for the sheet.
7) Add the Calendar Id in the code.
8) Add the Sheet Id in the code.
9) Download NodeJs in your PC.
10) Run 'npm install request' in Command Prompt
11) Run 'npm install googleapis' in Command Prompt

Tip : 
You can use tmux to run it 24x7 on virtual machines.
(https://stackoverflow.com/questions/50651416/run-python-constantly-on-the-google-cloud-platform)