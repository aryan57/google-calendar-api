function myFunction() {

  // clist apikey, username, and resources name
  var USER_NAME = '---';
  var API_KEY = '---';
  var RESOURCES = ["codingcompetitions.withgoogle.com", "leetcode.com", "facebook.com/hackercup", "codeforces.com", "codechef.com", "atcoder.jp"];

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

  var CALENDAR_ID = '---';
  var CALENDAR = CalendarApp.getCalendarById(CALENDAR_ID);


  /*

    // This piece of code will delete all events from MIN_DATE to MAX_DATE.
    // Use this for debugging purposes.

    var events = CALENDAR.getEvents(MIN_DATE, MAX_DATE);
    for (var i in events) {
      var ev = events[i];
      Logger.log("Event deleted -> " + ev.getTitle());
      ev.deleteEvent();
    }
  */

  /*
    global map of all events
    key - contest id provided by the clist_api which we use as event_id
    value - google calendar event object
  
    map is created to handle conflicts,
    suppose a particular contest got postponed,
    using the EVENTS_MAP, we can edit the postponed event and correct its time,description, etc.
  */
  var EVENTS_MAP = {};

  var events = CALENDAR.getEvents(MIN_DATE, MAX_DATE);

  for (i = 0; i < events.length; i++) {

    /*
      line 0 of description is the contest link
      line 1 of description is the unique contest id, as was provided by clist_api
    */

    // this split the description with '\n' as the splitting character
    var lines = events[i].getDescription().split(/\r?\n/);

    EVENTS_MAP[lines[1]] = events[i];
  }


  for (var j in RESOURCES) {
    var url = "https://clist.by/api/v1/contest/?username=" + USER_NAME + "&api_key=" + API_KEY + "&resource__name=" + RESOURCES[j] + "&start__gte=" + TODAY_STRING + "&order_by=start&duration__lte=" + MAX_DURATION;
    var response = UrlFetchApp.fetch(url);
    response = JSON.parse(response);

    var contests = response["objects"];

    for (var i in contests) {

      // new id found...
      if (EVENTS_MAP[contests[i]['id']] == null) {
        var ev = CALENDAR.createEvent(contests[i]['event'], new Date(contests[i]['start'] + "Z"), new Date(contests[i]['end'] + "Z"), { description: contests[i]['href'] + "\n" + contests[i]['id'] });
        Logger.log("Event created with [title : " + ev.getTitle() + "] and [resource name : " + RESOURCES[j] + "]");
        EVENTS_MAP[contests[i]['id']] = ev;
      }
      else {
        /*
          id was already present,
          it means, something may have changed about the contest,
          like it was postponed(time changed) etc.
        */
        var ev = EVENTS_MAP[contests[i]['id']];

        var is_change = false;

        if (ev.getTitle() != contests[i]['event']) {
          is_change = true;
        }
        if (ev.getDescription() != contests[i]['href'] + "\n" + contests[i]['id']) {
          is_change = true;
        }

        if (Utilities.formatDate(ev.getStartTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(new Date(contests[i]['start'] + "Z"), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
          is_change = true;
        }
        if (Utilities.formatDate(ev.getEndTime(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') != Utilities.formatDate(new Date(contests[i]['end'] + "Z"), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')) {
          is_change = true;
        }

        if (is_change == true) {
          Logger.log("Earlier the event [" + ev.getTitle() + "] was from " + ev.getStartTime() + " to " + ev.getEndTime());

          ev.setTitle(contests[i]['event']);
          ev.setTime(new Date(contests[i]['start'] + "Z"), new Date(contests[i]['end'] + "Z"));
          ev.setDescription(contests[i]['href'] + "\n" + contests[i]['id']);

          EVENTS_MAP[contests[i]['id']] = ev;

          Logger.log("Now the event [" + ev.getTitle() + "] is from " + ev.getStartTime() + " to " + ev.getEndTime());
        }
        else {
          Logger.log("Event [" + ev.getTitle() + "] was already created. No need to do anything!")
        }

      }

    }

  }
}
