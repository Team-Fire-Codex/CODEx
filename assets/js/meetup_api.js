/*
 * Author: Project #1 Fire
 * Project Name: Project Fire MeetUp API Search
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */


window.onload = function() {
$("#box").hide(100);
$('#zipHolder').hide();//Hides on window.load
$('#vids').hide();


//-----------------------------------------------------MeetUp Variables-------------------------------------------------------------------//
var topic = '';
var zip = '';
var results;
var meetUpKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
var tryZip = '';
//---------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------YouTube variables---------------------------------------------------------------//
var tubeURL = "https://www.googleapis.com/youtube/v3/";
var youTubeKey = "AIzaSyC4tz1TDHpgGTkAyNR9ycjU0cixA6bDNnk";
var videoSearch = '';
//---------------------------------------------------YouTube API------------------------------------------------------------------//
    
let getYouTube = function(){
      videoSearch = tubeURL + "search?&q=" + topic + "&part=snippet&chart=mostPopular&videoCategoryId=27&type=video&maxResults=1&key=" + youTubeKey;

                $.ajax({
                url: videoSearch,
                method: "GET",             
                dataType: 'jsonp'
            })
            .done(function(response) {
              console.log(response);
                    var videoId = response.items[0].id.videoId;

                    console.log(response.items[0]); ("<iframe width='100%' height='100%' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0'id='hi'></iframe>");                          
            });
};   

//-----------------------------------------------------Zip Code/Search logic---------------------------------------------------------//
function isValidUSZip(isZip) { // returns boolean; if user input is valid US zip code
   return /^\d{5}(-\d{4})?$/.test(isZip);
}

$('#zipSearch').on('click', function(event) { //on click of the zip code 'Go!' button 
  event.preventDefault(event);
  tryZip = $('#userZip:text').val();
  $('#searchError').html('')

  if (isValidUSZip(tryZip) === true) { //if Valid zip code set as user zip code.
    zip = tryZip;
    $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
    $('#searchError').html('');
    $('#zipHolder, #zipSearch, #zipForm').toggle();  //toggles either hide/display to these classes
  }
  else {
    $('#zipForm').addClass('has-error'); //if invalid zip, turns the search box red
  }
});

$('#changeZip').on('click', function(event) {
    $('#zipHolder, #zipSearch, #zipForm').toggle();
    $('#userZip:text').val('');
    $('#zipForm').removeClass('has-error');
});

$('#searchButton').on('click', function(event) {
  event.preventDefault(event);


  if ($('#searchInput:text').val().trim() !== '' && $("#zipHolder").is(":visible")) { //Prevents searching if there is no input,
    $("#box").show(100);
    $("#vids").empty().show();
    topic = $('#searchInput:text').val().trim();   
    console.log(videoSearch);                                 //sets topic to user input, makes api call,
    $('#toggleContainer').show();                                                  //clears search box
    $('#searchInput:text').val('');
    getYouTube();
    getMeetUp();
  }

  else if ($('#zipHolder').is(':hidden')) {
    $('#searchError').html('Please select a zip code.')
    $('#zipForm').addClass('has-error');
    $('#searchInput:text').val('');
  };

});

//---------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------MeetUp API Call-------------------------------------------------------//

let getMeetUp = function(){ 
    queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
    
    $.getJSON(queryUrl, null, function(data) { //initial API call      
      results = data.results;
      console.log(results);
          if (data.code === 'badtopic' || results.length === 0) { //if no meetup found based on user search, defaults to javascript meetups
            topic = 'javascript'
            queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
      
          $.getJSON(queryUrl, null, function(data){ // Second API call 
            results = data.results;
            $('#meetUpSidebar').html('We couldnt find any meetups meeting your search criteria. Here are a few others you may be interested in:' + '<br>' + '<br>');
            displayMeetUp();
          })
          }
          else {
            $('#meetUpSidebar').html('');
            displayMeetUp();
          };
      });

};

let displayMeetUp = function() {   //Displays up meetup on HTML, reformats unix time
    for (var i =0; i < 3; i ++){
      var meetUpDiv=$('<div>');
      var p =  $('<p>');
      var link = $('<a>');
      var img = $('<img>');
      var time = results[i].time;
      var timeMoment = moment(time, 'x');
      var currentTime = timeMoment.format('LLL')


      img.attr('src', results[i].group.photos[0].highres_link);
      img.css('width', '150px')
      img.css('height', '100px')
      link.attr('href', results[i].event_url)
      link.attr('target', '_blank');
      link.text('RSVP');
      meetUpDiv.addClass('meetUpDiv')
    if (results[i].venue === undefined) { //if no venue is listed
      p.html("<br>" + results[i].name + '<br>' + "Next Event: " + currentTime);
    }
    else {
      p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
    }
      meetUpDiv.append(p);
      meetUpDiv.append(img);
      meetUpDiv.append(link);
      $('#meetUpSidebar').append(meetUpDiv);
  
    }
};
//---------------------------------------------------------------------------------------------------------------------------------//
}; //window On load