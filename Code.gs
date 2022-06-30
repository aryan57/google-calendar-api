function myFunction() {

  // clist apikey, username, and resources name
  var USER_NAME = '';
  var API_KEY = '';
  var RESOURCES = ["codingcompetitions.withgoogle.com", "leetcode.com", "facebook.com/hackercup", "codeforces.com", "atcoder.jp"];

  var MAX_DATE = new Date('January 01, 2031 00:00:00 Z');
  var TODAY = new Date();
  var TODAY_STRING = Utilities.formatDate(TODAY, 'Etc/GMT', 'yyyy-MM-dd') + "T00:00:00Z";
  var MIN_DATE = new Date('January 01, 2021 00:00:00 Z');

  /*
    Maximum duration is 2592000 seconds or 30 days.
    This is added because some of the codechef contests are for practice,
    and are live for a year or so.
  */
  var MAX_DURATION = 2592000;

  var CALENDAR_ID = '';
  var CALENDAR = CalendarApp.getCalendarById(CALENDAR_ID);

  const CODECHEF_CALENDAR_ID = '';
  const CODECHEF_CALENDAR = CalendarApp.getCalendarById(CODECHEF_CALENDAR_ID);

  /*
    // This piece of code will delete all events from TODAY to MAX_DATE.
    // Use this for debugging purposes.

    var events = CALENDAR.getEvents(TODAY, MAX_DATE);
    for (var i in events) {
      var ev = events[i];
      Logger.log("Event deleted -> " + ev.getTitle());
      ev.deleteEvent();
    }
  /*

  /*
    global map of all events
    key - the url of the contest is used as the key
    value - google calendar event object
  
    map is created to handle conflicts,
    suppose a particular contest got postponed,
    using the EVENTS_MAP, we can edit the postponed event and correct its time,description, etc.
  */
  var EVENTS_MAP = {};

  var events = CALENDAR.getEvents(MIN_DATE, MAX_DATE);
  for (i = 0; i < events.length; i++) {
    EVENTS_MAP[events[i].getDescription()] = events[i];
  }

  // handling codechef events differently because clist api gives various unrated random contests from codechef
  var codechef_events = CODECHEF_CALENDAR.getEvents(TODAY,MAX_DATE);
  for(const [key,i] of Object.entries(codechef_events)){
    if(!i.getLocation())continue;

     // new contest link found...
        if (EVENTS_MAP[i.getLocation()] == null) {
          var ev = CALENDAR.createEvent(i.getTitle(), i.getStartTime(), i.getEndTime(), { description: i.getLocation()});
          Logger.log("Event created -> " + ev.getTitle());
          EVENTS_MAP[ev.getDescription()] = ev;
        }
        else {
          /*
            contest link was already present,
            it means, something may have changed about the contest,
            like it was postponed(time changed) etc.
          */
          var ev = EVENTS_MAP[i.getLocation()];

          var is_change = false;

          if (ev.getTitle() != i.getTitle()) {
            is_change = true;
          }

          if (Utilities.formatDate(ev.getStartTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(i.getStartTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
            is_change = true;
          }
          if (Utilities.formatDate(ev.getEndTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(i.getEndTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
            is_change = true;
          }

          if (is_change == true) {
            Logger.log("Event update from -> [" + ev.getTitle() + "] [" + ev.getStartTime().toLocaleString('en-GB', { timeZone: 'IST' }) + "] [" + ev.getEndTime().toLocaleString('en-GB', { timeZone: 'IST' })+"]");

            ev.setTitle(i.getTitle());
            ev.setTime(i.getStartTime(), i.getEndTime());

            EVENTS_MAP[ev.getDescription()] = ev;

            Logger.log("Event update to -> [" + ev.getTitle() + "] [" + ev.getStartTime().toLocaleString('en-GB', { timeZone: 'IST' }) + "] [" + ev.getEndTime().toLocaleString('en-GB', { timeZone: 'IST' })+"]");
          }
          else {
            Logger.log("Event unchanged  -> " + ev.getTitle());
          }
        }
  }
  
  for (var j in RESOURCES) {
    try
    {
      var url = "https://clist.by/api/v1/contest/?username=" + USER_NAME + "&api_key=" + API_KEY + "&resource__name=" + RESOURCES[j] + "&start__gte=" + TODAY_STRING + "&order_by=start&duration__lte=" + MAX_DURATION;
      var response = UrlFetchApp.fetch(url);
      response = JSON.parse(response);

      var contests = response["objects"];

      for (var i in contests) {

        // new contest link found...
        if (EVENTS_MAP[contests[i]['href']] == null) {
          var ev = CALENDAR.createEvent(contests[i]['event'], new Date(contests[i]['start'] + "Z"), new Date(contests[i]['end'] + "Z"), { description: contests[i]['href']});
          Logger.log("Event created -> " + ev.getTitle());
          EVENTS_MAP[contests[i]['href']] = ev;
        }
        else {
          /*
            contest link was already present,
            it means, something may have changed about the contest,
            like it was postponed(time changed) etc.
          */
          var ev = EVENTS_MAP[contests[i]['href']];

          var is_change = false;

          if (ev.getTitle() != contests[i]['event']) {
            is_change = true;
          }

          if (Utilities.formatDate(ev.getStartTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(new Date(contests[i]['start'] + "Z"), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
            is_change = true;
          }
          if (Utilities.formatDate(ev.getEndTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(new Date(contests[i]['end'] + "Z"), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
            is_change = true;
          }

          if (is_change == true) {
            Logger.log("Event update from -> [" + ev.getTitle() + "] [" + ev.getStartTime().toLocaleString('en-GB', { timeZone: 'IST' }) + "] [" + ev.getEndTime().toLocaleString('en-GB', { timeZone: 'IST' })+"]");

            ev.setTitle(contests[i]['event']);
            ev.setTime(new Date(contests[i]['start'] + "Z"), new Date(contests[i]['end'] + "Z"));

            EVENTS_MAP[contests[i]['href']] = ev;

            Logger.log("Event update to -> [" + ev.getTitle() + "] [" + ev.getStartTime().toLocaleString('en-GB', { timeZone: 'IST' }) + "] [" + ev.getEndTime().toLocaleString('en-GB', { timeZone: 'IST' })+"]");
          }
          else {
            Logger.log("Event unchanged -> " + ev.getTitle());
          }

        }

      }
    }catch(e)
    {
      console.log("Error in getting constests from clist API.")
    }

  }
}
