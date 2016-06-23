var weathericons = { // Converts API weather codes to image names
	"01d": "Sun",
	"01n": "Bright Moon",
	"02d": "Partly Cloudy Day",
	"02n": "Partly Cloudy Night",
	"03d": "Clouds",
	"03n": "Clouds",
	"04d": "Clouds Filled",
	"04n": "Clouds Filled",
	"09d": "Rain",
	"09n": "Rain",
	"10d": "Torrential Rain",
	"10n": "Torrential Rain",
	"11d": "Storm",
	"11n": "Storm",
	"13d": "Snow",
	"13n": "Snow",
	"50d": "Fog Day",
	"50n": "Fog Night",
}

// Contains user preferences
var config = { 
	city: "Christchurch", //country and city codes for the weather API
	countrycode: "NZ",
	maxnewsitems: 5, //maximum amount of news headlines to be displayed at one time
	newsinterval: 5000,
}

var newsData;

// Initialising setTime on launch
$(window).ready(function() {
	setTime();
	setInterval(setTime,1000);
	
	scaleText();
	$(window).on("resize", scaleText);

	getWeather();
	setInterval(getWeather, 1000*60*30) //30 mins

	getNews();
	setInterval(getNews, 1000*60*15) //15 mins
}); 

var basetextsize = 15;

// Creating setTime function
function setTime() {
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var day = d.getDay();
	var date = d.getDate();
	var month = d.getMonth();

	// Setting Day names
	var daynames = [null, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var daystring = daynames[day];

	// Setting Month names	
	var monthnames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	var monthstring = monthnames[month];

	// Setting Meridian	
	if (hours < 12) {
		var meridian = "AM";
		
		if (hours == 0) {
			hours = 12;
		}
	} else {
		var meridian = "PM";
		hours = hours - 12;

		if (hours == 0) {
			hours = 12;
		}
	}

	// Fixing Minutes
	if (minutes < 10){
		minutes = "0" + minutes;
	}

	// Setting Date superscript
	var datedigit = date%10;
	if (datedigit == 1) {
		var datesuper = "st";
	} else if (datedigit == 2) {
		var datesuper = "nd";
	} else {
		var datesuper = "th";
	}

	// Displaying data
	$("#time-hours").html(hours + ":");
	$("#time-minutes").html(minutes);
	$("#time-meridian").html(meridian);
	$("#time-day").html(daystring);
	$("#time-date").html(date);
	$("#time-datesuper").html(datesuper);
	$("#time-month").html(monthstring);

	
}

// Loads script from openweathermap.org
function getWeather() {
	console.log(getWeather);
	var city = config.city;
	var countrycode = config.countrycode;
	$("body").append("<script id='weatherscript' src='http://api.openweathermap.org/data/2.5/weather?q="+city+","+countrycode+"&callback=showWeather&APPID=5fcad9c504c1d9092487440b763ea526'></script>");
}

// Called when weather loads, removes script
function showWeather(response) {
	console.log(response);
	$("#weatherscript").remove();
	var temperature = response.main.temp - 273.15; // Converts from Kelvin to Celcius
	$("#weather-temp").html(Math.round(temperature) + "&deg;"); // Adds degree symbol to temperature
	$("#weather-conditions").html(response.weather[0].main) // Finds conditions from response
	$("#weather-location").html(response.name + ", " + response.sys.country); // Finds location from response and adds them together
	
	i = response.weather[0].icon;
	i_type = i.substring(0,2);


	if ((new Date(response.sys.sunrise*1000)) < (new Date()) && (new Date()) < (new Date(response.sys.sunset*1000))) {
		var icon = weathericons[i_type + "d"];
	} else {
		var icon = weathericons[i_type + "n"];
	}
	$("#weather-icon").attr("src","icons/weather/" + icon + ".png"); // Finds icon name and attributes it to icon in folder

	
}

function scaleText() { //Scales the text size to stay constant regardless of window size
	//Base
	var width = $("#time").width();
	textbasesize = width*0.3;

	//Time
	$("#time-hours,#time-minutes").css("font-size",textbasesize);
	$("#time-meridian").css("font-size", textbasesize*0.4);
	$("#time-day,#time-month,#time-date").css("font-size", textbasesize*0.3);

	// Weather
	$("#weather-temp").css("font-size",textbasesize); 
	$("#weather-location, #weather-conditions").css("font-size", textbasesize*0.3);
	$("#weather-icon").height(textbasesize);

	//News
	$("#news").css("font-size", textbasesize*0.18);
	$(".news-item img").height(textbasesize*0.18);
}

function getNews() {
	$.getFeed({
		url:"proxy.php?url=http://www.stuff.co.nz/rss/", //RSS feed links
		success: function(feed){
			newsData = feed;
			newsData.index = 0;
			$("#news").html("");
			var html = ""
			for (var i = 0; i < Math.min(feed.items.length, config.maxnewsitems); i++) { //Loops through headline array
				var item = feed.items[i];

                html += '<span class="news-item"><img src="icons/news/Google News.png">' //Adds newspaper image
                + item.title
                + '</span>';
			}
			$("#news").append(html);
			scaleText(); //Scales images and text
			setInterval(newsScroll, config.newsinterval);
		}
	})
}

function newsScroll() {
	var textHeight = $(".news-item").height() + 10;//height of one news-item ($().height + 10px padding)

	$("#news").css("transform", "translatey(" + (0-textHeight) + ")"); //translate for value of the height of headline

	$(".news-item:first-child").css("opacity", 0);//makes headline invisible

	setTimeout(function(){
		$(".news-item:first-child").remove(); //removes the top headline
		$("#news").css("transition", ""); //removes the transition
		$("#news").css("transform", "translatey(0)"); //translates list back down 
		$("#news").css("transition", "translateY 1s, opacity 1s"); //add the transition back for the next headline
		var html = '<span class="news-item"><img src="icons/news/Google News.png">' //Adds newspaper image
                + newsData.items[newsData.index + config.maxnewsitems].title;
                + '</span>';
        $("#news").append(html);
        newsData.index += 1;
        if(newsData.index + config.maxnewsitems >= newsData.items.length) {
        	newsData.index = 0;
        }
        scaleText();
	}, 1000);
}
