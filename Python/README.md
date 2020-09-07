This API Google Calendar is made using Python.
I used Google Service Account and Google Calendar API for this.

Steps : 
1) Make a project in Google Cloud.
2) Add Google Calendar API in the project
3) Create a google service account for the project
4) Download the key of Service Account in JSON format and save it in the project folder as 'service-account.json' .
5) Share the Google Calendar with the  service account email id with edit access for the calendar.
6) Add the Calendar Id in the code.

> Run these 3 coomands in Command Prompt.
>> pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib\
>> pip3 install request\
>> pip3 install datetime\

Tip : 
You can use tmux to run it 24x7 on virtual machines.
(https://stackoverflow.com/questions/50651416/run-python-constantly-on-the-google-cloud-platform)
