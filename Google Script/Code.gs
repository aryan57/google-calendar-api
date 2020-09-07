function doGet(e)
{
  
  
  var calendar_ID = ''; // TO BE ADDED
  var contest_SITE ='https://www.kontests.net/api/v1/at_coder';

  var calendar = CalendarApp.getCalendarById(calendar_ID);
  
  var response = UrlFetchApp.fetch(contest_SITE);
  

  var contests = {}; 
  
  try
  {
    // Regular expression for JSON content-type
    var jsr = new RegExp(/application\/json/);
    var cnt = response.getAllHeaders()["Content-Type"];
    
    // Check if response is JSON
    if (jsr.exec(cnt))
    {
      // Parse response content
      var js =  JSON.parse( response.getContentText() );
      
      for (var i in js)
      {
        contests[i] = js[i];
      }
      
    }
  }
  catch(error)
  {
    Logger.log(error)
  }
  
  
  // first delete all events from 1-jan-2020 to 1-jan-2025
  //  javascript counts months from 0
  var events = calendar.getEvents(new Date(2020,0,1,0,0,0), new Date(2025,0,1,0,0,0));
  
  for(var i in events)
  {
    var ev = events[i];
    Logger.log("Event deleted -> ",ev.getTitle());
    ev.deleteEvent();
  }
  
  //now add required events
  for(var i in contests)
  {
    var ev = calendar.createEvent(contests[i]['name'], new Date(contests[i]['start_time']), new Date(contests[i]['end_time']), {description : contests[i]['url']});
    Logger.log("Event created -> ",ev.getTitle());
  }
  
}
