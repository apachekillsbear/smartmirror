
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '320403617576-n6uu76bfuejij5tonhhcql6iso7tpan4.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.client.setApiKey("AIzaSyD8oq_UD3aemoOJpoGTQ_oDBOw0ZOaTMZs");
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true,
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  console.dir(authResult)
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  console.log('load')
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'alihugh.abbari@gmail.com',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(showEvents);
}


function showEvents(resp) {
  console.log('show');
  var events = resp.items;
  $("#agenda-table").html("");

  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      console.dir(event);
      var eventDate = new Date(event.start.dateTime);
      var date = eventDate.getDate();
      var day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][eventDate.getDay()]; //Designates the integer values to string values for days of the week
      var hours = eventDate.getHours();

      if (hours < 12) {
        var meridian = " AM"; //Sets the meridian (AM/PM) to the correct type for the time.
        
        if (hours == 0) {
          hours = 12;
        }
      } else {
        var meridian = " PM";
        hours = hours - 12;

        if (hours == 0) { //Fixes the issue where 12:00PM would display as 0:00PM
          hours = 12;
        }
      }

      $("<tr>").append(
        $("<td id=event-day>").html(day) //Displays the day of the week as a cell in the table
      ).append(
        $("<td>").html(date)  //Displays the date as a cell in the table
      ).append(
        $("<td>").html(hours + meridian) //Displays the start time of the event as a cell in the table
      ).append(
        $("<td>").html(event.summary) //Displays the event description as a cell in the table
      )
      .appendTo($("#agenda-table"));
    }
  } else {
    //appendPre('No upcoming events found.');
  }

  
  scaleText();
}

//setInterval(function(){$("span, td").html("o shit waddup")}, 300)