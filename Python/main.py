# imports for google
from google.oauth2 import service_account
from googleapiclient.discovery import build

# import for kontests
import requests

import datetime

# setup for google api
calendar_ID = '' # TO BE ADDED
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'service-account.json'
creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('calendar', 'v3', credentials=creds)

start_time_list=dict()
today_list=dict()

while True :

    current_time = datetime.datetime.now()
    today = str(current_time.day) + '-' + str(current_time.month) + '-' + str(current_time.year) + ' : ' + str(current_time.hour) +'hrs'

    if today not in today_list :
        today_list[today]=True
        print(today)
        fhand=open('logs.txt','a')
        fhand.write(today+'\n')
        fhand.close()

        data = requests.get("https://www.kontests.net/api/v1/at_coder").json()

        for contests in data:

            cur_event = {
                'summary': contests['name'],
                'description': contests['url'],
                'start': {'dateTime': contests['start_time']},
                'end': {'dateTime': contests['end_time']}
            }

            if contests['start_time'] not in start_time_list :
                start_time_list[contests['start_time']]=True
                event = service.events().insert(calendarId=calendar_ID, body=cur_event).execute()
                print('Event Created! for',contests['start_time'])
                fhand=open('logs.txt','a')
                fhand.write('Event Created! for '+contests['start_time']+'\n')
                fhand.close()