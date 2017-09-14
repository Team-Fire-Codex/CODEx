/*
 * Author: Project #1 Fire
 * Project Name: Project Fire custom page JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */

// Nav Transition
$('body').on('click', function () {
  if ($('.nav-tabs').children().length == 0) {
    $(".nav-tabs").css("visibility","hidden");
    $(".site-nav").addClass("active");
    $(".navbar-brand").addClass("fade-out").removeClass("fade-in");
    $(".logo").removeClass("fade-out").addClass("fade-in");
    $('.sidebar').hide();
  } else {
    $(".nav-tabs").css("visibility","visible");
    $(".site-nav").removeClass("active");
    $(".navbar-brand").addClass("fade-in").removeClass("fade-out");
    $(".logo").removeClass("fade-in").addClass("fade-out");
  }
});
//Prevents sidebar from closing when meetUp RSVP is clicked
$(document).on('click', '.RSVP', function(e) { 
  e.stopPropagation();
});

//If sidebar of current tab is open, sidebar of newly clicked tab will also open.
$(document).on('click', 'li', function() {  
  $('li').find('nav').removeClass('active'); 
  if ($('li').find('nav').hasClass('open')) { 
    $('li').find('nav').removeClass('open');
    $(this).find('nav').addClass('open');
  }
  if ($(this).hasClass('active')) {
    $(this).find('nav').addClass('active');
  }
})

// Tab Clear
$('.nav-tabs').on("click", "button", function () {
    var anchor = $(this).siblings('a');
    $(anchor.attr('href')).remove();
    $(this).parent().remove();
    $(".nav-tabs li").children('a').first().click();
});

// Sidebar Transitions
$(document).on('click', '.sidebar', function(event) {
    event.preventDefault();
    $(this).toggleClass("open");
});

window.onload = function() {
//Hides on window.load
$('#zipHolder').hide();
$('.sidebar-left').hide();
//-----------------------------------------------------MeetUp Variables-------------------------------------------------------------------//
var topic = '';
var zip = '';
var results;
var meetUpKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
var tryZip = '';
var sidebarId = '';
var defaultTopic = '';
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------YouTube variables--------------------------------------------------------------------------//
var tubeURL = "https://www.googleapis.com/youtube/v3/";
var youTubeKey = "AIzaSyC4tz1TDHpgGTkAyNR9ycjU0cixA6bDNnk";
var videoSearch = '';
//----------------------------------------------------------YouTube API-------------------------------------------------------------------------------------// 
let getYouTube = function(){
  videoSearch = tubeURL + "search?&q=" + topic + '%20coding%20tutorial' + "&part=snippet&chart=mostPopular&videoCategoryId=27&type=video&relevanceLanguage=en&maxResults=1&key=" + youTubeKey;
  var youtubeId = $('#' + topic + 'video');

  $.ajax({
    url: videoSearch,
    method: "GET",             
    dataType: 'jsonp'
  })
  .done(function(response) {
    var videoId = response.items[0].id.videoId;
    youtubeId.append("<iframe width='100%' height='100%' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0'id='hi'></iframe>")  
    });
};   
//---------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------Zip Code/Search logic-----------------------------------------------------------------------//
//returns boolean; checks if user input is valid US zip code
function isValidUSZip(isZip) { 
  return /^\d{5}(-\d{4})?$/.test(isZip);
}
//on click of the zip code 'Go!' button. 
$('#zipSearch').on('click', function(event) { 
  event.preventDefault(event);
  tryZip = $('#userZip:text').val();
  $('#noZip').html('')
//if Valid zip code set as user zip code and stores zip code locally.
  if (isValidUSZip(tryZip) === true) { 
    zip = tryZip;
    localStorage.clear();
    localStorage.setItem('zip', zip);
    $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
    $('#searchError').html('');
    $('#zipHolder, #zipSearch, #zipForm').toggle();
  }
//if invalid zip, turns the search box red
  else {
    $('#zipForm').addClass('has-error'); 
  }
});
//Function to change zip code
$('#changeZip').on('click', function(event) {
  $('#zipHolder, #zipSearch, #zipForm').toggle();
  $('#userZip:text').val('');
  $('#zipForm').removeClass('has-error');
});
//checks if there is a zip in local storage, if there is, sets that as current zip
let checkZip = function() {
  if (localStorage.getItem("zip") !== null) {
    zip = localStorage.getItem('zip');
    $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
    $('#searchError').html('');
    $('#zipHolder, #zipSearch, #zipForm').toggle(); 
  };
};

//------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------MeetUp API Call-----------------------------------------------------------------------------//

let getMeetUp = function(){ 
  queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';

//initial API call  
  $.getJSON(queryUrl, null, function(data) {     
    results = data.results;
//if no meetup found based on user search, defaults to javascript meetups
    if (data.code === 'badtopic' || results.length === 0 || results == undefined) { 
      defaultTopic = 'javascript'
      queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + defaultTopic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
        $.getJSON(queryUrl, null, function(data){ 
          results = data.results;
          displayMeetUp();
        })
    }
    else {
      $('#meetUpSidebar').html('');
      displayMeetUp();
    };
  });
};
//Dynamically displays meetup sidebar, reformats unix time for next event
let displayMeetUp = function() {   
  for (var i =0; i < 3; i ++){
    var meetUpDiv=$('<div>');
    var p =  $('<p>');
    var link = $('<a>');
    var img = $('<img>');
    var time = results[i].time;
    var timeMoment = moment(time, 'x');
    var currentTime = timeMoment.format('LLL')
    var sidebarId = $('#' + topic + 'sidebar');

    img.attr('src', results[i].group.photos[0].highres_link);
    img.css('width', '150px')
    img.css('height', '100px')

    link.attr('href', results[i].event_url)
    link.attr('target', '_blank');
    link.addClass('RSVP');
    link.text('RSVP');

    
//if no venue is listed, remove venue from display
  if (results[i].venue === undefined) { 
    p.html("<br>" + results[i].name + '<br>' + "Next Event: " + currentTime);
  }
  else {
    p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
  }
    meetUpDiv.addClass('meetUpDiv')
    meetUpDiv.append(p);
    meetUpDiv.append(img);
    meetUpDiv.append(link);
    $(meetUpDiv).appendTo(sidebarId);
  }
};
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------Modal Generation for search-------------------------------------------------------------------------------//
var topics = [];
    // Function - Generates tabs of search input submitted
function searchTab() {
  var codepen = $("<iframe height='300' scrolling='no' title='RZvYVZ' src='//codepen.io/marcorulesk345/embed/RZvYVZ/?height=300&theme-id=31149&default-tab=html,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/marcorulesk345/pen/RZvYVZ/'>RZvYVZ</a> by marco (<a href='https://codepen.io/marcorulesk345'>@marcorulesk345</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>");
  // For Loop - To cull search results
  for (var i = 0; i < topics.length; i++) {
    // Remove current tab class="active"
    $("#myTab").find("li").removeClass('active');
    // Remove current content class="active in"
    $("#myTabContent").find("div").removeClass('active in');
    // Variable - Define <div> to place search results in
    var contentDiv = $("<div>");
    // Variable - Define .content to place class="" in
    contentDiv.attr("class", "tab-pane fade active in");
    // Variable - Define .content to place class="" in
    contentDiv.attr("id", topics[i]);
    contentDiv.css({'height': '350px', 'width': '100%', 'text-align': 'center'});
    // Variable - Define <li> to generate search tab
    var searchTab = $('<li>');
    // Attribute to searchTab - class="active"
    searchTab.attr("class", "active");
    // Attribute to showTab - data-search="topics[i]"
    searchTab.attr("data-search", topics[i]);

    // Variable - Define <a> to generate input result
    var tabAncr = $("<a data-toggle='tab'>");
    // Attribute to showTab - href="#topics[i]"
    tabAncr.attr("href", "#" + topics[i]);
    // Text to showTab - displays search input on showTab. Accounts for a space in user search
    topic = topic.split('_').join(' ');
    tabAncr.text(topic);
    topic = topic.split(' ').join('_');
    // Variable - Button to delete search tab
    var tabButton = $("<button type='button' class='close'>&times;</button>");
    // Append with tabAncr - id="myTab"
    searchTab.append(tabAncr);
    // Append with tabButton - id="myTab"
    searchTab.append(tabButton);

    //create sidebar for each result
    var sideBar = $('<nav>');
    sideBar.addClass('sidebar sidebar-right');
    sideBar.attr('id', topic + 'sidebar');   
    var meetUpHeader = $('<h3>');
    meetUpHeader.css({'height': '60px', 'font-size': '14px', 'text-align': 'center'});
    meetUpHeader.text('MeetUps Near You');
    sideBar.append(meetUpHeader);
    searchTab.append(sideBar);

    codepen.css({'height': '300px', 'width': '80%', 'text-align': 'center', 'margin': '0px 10% 0px 10%'})
    var vids = $('<div>');
    vids.attr('id', topic + 'video');
    vids.css({'height': '350px', 'width': '80%', 'text-align': 'center', 'margin': '0px 10% 0px 10%'})
    contentDiv.append(vids);
    contentDiv.append(codepen);       
  };        
    // Append with searchTab - id="myTab"
    $("#myTab").append(searchTab);
    // Append with contentDiv - id="myTabContent"
    $("#myTabContent").append(contentDiv);
};
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------Search on click functions-------------------------------------------------------------------------------//
//Capitalizes first letter of search input
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
//Function- If sidebar was open at time of search, new search will have an open sidebar
function sidebarStatus() {
var topicQuery = $('#' + topic + 'sidebar');
$('li').find('nav').removeClass('active'); 
  if ($('li').find('nav').hasClass('open')) {
      ($('li').find('nav').removeClass('open'));
      topicQuery.addClass('open', 'active');       
  }
}
//On search
$('#searchButton').on('click', function(event) {
event.preventDefault(event);
var tabOpen = false;
//Prevents searching if there is no input
  if ($('#searchInput:text').val().trim() !== '' && $("#zipHolder").is(":visible")) {
    topic = $('#searchInput:text').val().trim();
    topic = topic.capitalize();
//Checks to see if searched topic is already open in a tab, if it is, goes to that tab
    $('#myTab').find('li').removeClass('active');
    $('#myTab').find('li').each(function (){
      $(this).find('a').attr('aria-expanded', 'false');
      if ($(this).attr('data-search') == topic) {
        $("#myTabContent").find("div").removeClass('active in');
        $('#' + topic).addClass('tab-pane active in')
        $(this).addClass('active');
        $(this).find('a').attr('aria-expanded') === true;
        tabOpen = true;
        $('#searchInput:text').val('');
      }
    });
//if there is no tab open for the searched topic, open new tab
    if (!tabOpen) {
//accounts for space/slash in user input
      topic = topic.split(' ').join('_');
      topic = topic.split('/').join('_');                                          
      topics.push(topic);                  
      searchTab();
      sidebarStatus();
      $('.sidebar-left').show();                                     
      $('#searchInput:text').val(''); 
      getYouTube();
      getMeetUp();
    };

  }
//user validation, must enter zip code to search
  else if ($('#zipHolder').is(':hidden')) {
    $('#noZip').html('Please select a zip code.')
    $('#zipForm').addClass('has-error');
    $('#searchInput:text').val('');
  };
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------Quiz Modal Generation--------------------------------------------------------------------------------------------//
//generates tab modal for each quiz dynamically.
function quizTab() {
  // For Loop - To cull search results
  for (var k = 0; k < topics.length; k++) {
    // Remove current tab class="active"
    $("#myTab").find("li").removeClass('active');
    // Remove current content class="active in"
    $("#myTabContent").find("div").removeClass('active in');
    // Variable - Define <div> to place search results in
    var contentDiv = $("<div>");
    // Variable - Define .content to place class="" in
    contentDiv.attr("class", "tab-pane fade active in");
    // Variable - Define .content to place class="" in
    contentDiv.attr("id", topics[k]);
    contentDiv.css({'height': '350px', 'width': '80%'});
    // Variable - Define <li> to generate search tab
    var searchTab = $('<li>');
    // Attribute to searchTab - class="active"
    searchTab.attr("class", "active");
    // Attribute to showTab - data-search="topics[i]"
    searchTab.attr("data-search", topics[k]);

    // Variable - Define <a> to generate input result
    var tabAncr = $("<a data-toggle='tab'>");
    // Attribute to showTab - href="#topics[i]"
    tabAncr.attr("href", "#" + topics[k]);
    // Text to showTab - displays search input on showTab
    topic = topic.split('_').join(' ');
    tabAncr.text(topic);
    topic = topic.split(' ').join('_');
    // Variable - Button to delete search tab
    var tabButton = $("<button type='button' class='close'>&times;</button>");
    // Append with tabAncr - id="myTab"
    searchTab.append(tabAncr);
    // Append with tabButton - id="myTab"
    searchTab.append(tabButton);

    //create meetup sidebar for each quiz.
    var sideBar = $('<nav>');
    sideBar.addClass('sidebar sidebar-right');
    sideBar.attr('id', topic + 'sidebar');   
    var meetUpHeader = $('<h3>');
    meetUpHeader.css({'height': '60px', 'font-size': '14px', 'text-align': 'center'});
    meetUpHeader.text('MeetUps Near You');
    sideBar.append(meetUpHeader);
    searchTab.append(sideBar);
  }        
  // Append with searchTab - id="myTab"
  $("#myTab").append(searchTab);

  // Append with contentDiv - id="myTabContent"
  $("#myTabContent").append(contentDiv);
};

function insertQuestion (question){
//Inserts questions from argued JS quiz object
  for (var j =0; j <  10; j++) {
    nextQuestion = question[j];
    var questionDiv = $('<div>');
    questionDiv.text('Question ' + (j + 1))
    questionDiv.attr('id', 'Question' + j);
    questionDiv.css({'text-align': 'center', 'font-size': '18px'});
      for(var k in nextQuestion) {
        answer = $("<div>");
        answer.addClass(k);
        answer.html(nextQuestion[k]);
        questionDiv.append(answer);
        $('#' + topic).append(questionDiv);
      }
    var br = $('<br>')
    questionDiv.append(br);
  }
//Creates Submit/Reset button  
  var quizSubmit = $('<button>');
  quizSubmit.attr('id', 'quizSubmit');
  quizSubmit.text('Submit');
  quizSubmit.append($('<br>'));
  quizSubmit.attr('href', '#top');
  $('#' + topic).append(quizSubmit);
  var resetButton = $('<button>')
  resetButton.attr('id', 'resetButton');
  resetButton.text('Reset');
  $('#' + topic).append(resetButton)
  resetButton.hide();
}
//Checks to see if quiz tab is already open. If it is, goes to that tab. If it is not, generates new quiz tab
$('.quiz').on('click', function(e) {
  topic = this.id;
  console.log(topic);
  e.stopPropagation();
  var tabOpen = false;
  $('#myTab').find('li').removeClass('active');
  $('#myTab').find('li').each(function (){
    $(this).find('a').attr('aria-expanded', 'false');
    if ($(this).attr('data-search') == topic) {
      $("#myTabContent").find("div").removeClass('active in');
      $('#' + topic).addClass('tab-pane active in')
      $(this).addClass('active');
      $(this).find('a').attr('aria-expanded') === true;
      tabOpen = true;
      $('.quiz').parent().parent().removeClass('open'); 
    }
  });
  if (!tabOpen) {
    topics.push(topic);
    quizTab();
    getMeetUp();
    insertQuestion(quizzes[topic]);
    $('.quiz').parent().parent().removeClass('open'); 
  }
  //closes sidebar when you select a quiz
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------Quiz Logic---------------------------------------------------------------------------//
var correct = 0;
//adds/removes classes to correct answer for CSS styling
$(document).on('click', '.correctAnswer', function() {
  $(this).siblings().removeClass('selected');
  $(this).siblings().removeClass('correct');
  $(this).siblings().removeClass('incorrect');
  $(this).addClass('correct');
  $(this).addClass('selected');
});
//adds/removes classes to incorrect answers for CSS styling
$(document).on('click', '.answer1, .answer2, .answer3', function() {
  if ($(this).siblings().hasClass('correctStatus')) {
    return;
  }
  $(this).siblings().removeClass('correct');
  $(this).siblings().removeClass('selected');
  $(this).siblings().removeClass('incorrect');
  $(this).addClass('selected');
  $(this).addClass('incorrect');
});
//On submit button click
$(document).on('click', '#quizSubmit', function() {
//resets correct to zero
  correct = 0;
//removes result DIV
  $('#results').remove();
//Counts every div with class correct and adds to correct var
  $(this).parent().children().find('div').each(function(){
    if ($(this).hasClass('correct')) {
      correct++;
    };
  });
//Goes through each answer div and adds classes for right and wrong answers for CSS styling
  $(this).parent().children().find('div').each(function(){
    $(this).removeClass('selected')
      if ($(this).hasClass('correctAnswer')) {
        $(this).addClass('correctStatus');
      }
      else if ($(this).hasClass('incorrect')){
        $(this).addClass('incorrectStatus');
      };
  });
    var resultsDiv = $('<div>');
    resultsDiv.attr('id', 'results');
    resultsDiv.text('You got ' + correct + '/10 correct!')
    $(this).parent().append(resultsDiv);
    $('#quizSubmit').hide();
    $('#resetButton').show();
    $('#results').show();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});
//On reset button click, goes through answer divs and removes all classes
$(document).on('click', '#resetButton', function() {
  $(this).parent().children().find('div').each(function(){
    $(this).removeClass('correctStatus')
    $(this).removeClass('correct')
    $(this).removeClass('incorrectStatus')
    $(this).removeClass('incorrect')
  });
//Shows submit button, hides results, hides reset button
    $('#quizSubmit').show();
    $('#results').remove();
    $('#resetButton').hide();
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------Quiz objects-------------------------------------------------------------------------------------//
var quizzes = {
  HTML_Quiz: {
    0: {
      question: "What does HTML stand for?",
      answer1: "Home Tool Markup Language",
      correctAnswer: "Hyper Text Markup Language",
      answer2: "Hyperlinks and Text Markup Language",
    },
    1:   {
      question: "Choose the correct HTML (<>) element for the largest heading:",
      answer1: "head",
      answer2: "h6",
      correctAnswer: "h1",
      answer3: "heading",   
    },
    2: {
      question: "What is the correct HTML (<>) element for inserting a line break?",
      answer1: "break",
      answer2: "lb",
      correctAnswer: "br",   
    },
    3: {
      question: "Which of these elements are all <table> elements?",
      answer1: "table,tr,tt",
      correctAnswer: "table,tr,td",
      answer2: "table, head, tfoot",
      answer3: "thead, body, tr",   
    },
    4:  {
      question: "How can you make a bulleted list?",
      answer1: "list",
      answer2: "dl",
      answer3: "ul",
      correctAnswer: "ol",   
    },
    5:  {
      question: "An iframe is used to display a web page within a web page.",
      correctAnswer: "True",
      answer1: "There is no such thing as an iframe.",
      answer2: "false",  
    },
    6:  {
      question: "HTML comments start with <!-- and end with -->",
      correctAnswer: "true",
      answer1: "false",   
    },
    7:  {
      question: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
      answer1: "longdesc",
      answer2: "title",
      correctAnswer: "alt", 
      answer3: "src",
    },
    8:  {
      question: "Which HTML (<>) element is used to specify a footer for a document or section?",
      answer1: "section",
      correctAnswer: "footer", 
      answer2: "bottom",
    },
    9:  {
      question: "Which HTML element defines navigation links?",
      answer1: "navigation",
      answer2: "navigate",
      correctAnswer: "nav", 
      }
    },
    CSS_Quiz: {
    0: {
      question: "In css, h1 is considered a/an",
      answer1: "Tag",
      answer2: "Element",
      correctAnswer: "Selector",
      answer3: "Attribute",
    },
    1:   {
      question: "Which HTML attribute is used to define inline styles?",
      answer1: "Styles  ",
      answer2: "Class",
      correctAnswer: "Style",
      answer3: "Font",   
    },
    2: {
      question: "Which CSS property controls the text size?",
      answer1: "text-style",
      answer2: "font-style",
      answer3: "text-size",
      correctAnswer: "font-size",   
    },
    3: {
      question: "In css, font-size is considered a/an",
      answer1: "Selector",
      correctAnswer: "Property-name",
      answer2: "Rule",
      answer3: "Property",   
    },
    4:  {
      question: "Where in an HTML document is the correct place to refer to an external style sheet?",
      answer1: "At the end of the document",
      answer2: "In the <body> section",
      correctAnswer: "In the <head> section",   
    },
    5:  {
      question: "Which is the correct CSS syntax?",
      correctAnswer: "body {color: black;}",
      answer1: "body:color=black;",
      answer2: "{body:color=black;}",
      answer3: "{body;color:black;}",   
    },
    6:  {
      question: "Which property is used to change the background color?",
      answer1: "color",
      answer2: "bgcolor",
      correctAnswer: "background-color",   
    },
    7:  {
      question: "Which property is used to change the font of an element?",
      answer1: "font",
      answer2: "font-family",
      correctAnswer: "Both font-family and font can be used",  
    },
    8:  {
      question: "Which property is used to change the left margin of an element?",
      answer1: "padding-left",
      correctAnswer: "margin-left", 
      answer2: "indent",
    },
    9:  {
      question: "How do you select an element with id demo?",
      answer1: ".demo",
      answer2: "demo",
      correctAnswer: "#demo",  
      answer3: "%demo",  
      }
    },
    Javascript_Quiz: {
    0: {
      question: "Inside which HTML element (<>) do we put the JavaScript?",
      answer1: "javascript",
      answer2: "scripting",
      correctAnswer: "script",
      answer3: "js",
    },
    1:   {
      question: "How do you create a function in JavaScript?",
      answer1: "function:myFunction()",
      answer2: "function myFunction()",
      correctAnswer: "function = myFunction()",
    },
    2: {
      question: "How do you call a function named myFunction?",
      answer1: "call function myFunction()",
      answer2: "call myFunction()",
      correctAnswer: "myFunction()",   
    },
    3: {
      question: "How to write an IF statement in JavaScript?",
      answer1: "if i = 5 then",
      correctAnswer: "if (i == 5)",
      answer2: "if i == 5 then",
      answer3: "if i = 5",   
    },
    4:  {
      question: "How to write an IF statement for executing some code if i is NOT equal to 5?",
      answer1: "if i =! 5 then",
      answer2: "if (i <> 5)",
      answer3: "if i <> 5",
      correctAnswer: "if (i != 5)",   
    },
    5:  {
      question: "How does a WHILE loop start?",
      correctAnswer: "while (i <= 10)",
      answer1: "while (i <= 10; i++)",
      answer2: "while i = 1 to 10",
    },
    6:  {
      question: "How does a FOR loop start?",
      answer1: "for i = 1 to 5",
      answer2: "for (i = 0; i <= 5)",
      answer3: "for (i <= 5; i++)",
      correctAnswer: "for (i = 0; i <= 5; i++)",   
    },
    7:  {
      question: "How do you find the number with the highest value of x and y?",
      answer1: "Math.max(x, y)",
      answer2: "top(x, y)",
      correctAnswer: "Math.ceil(x, y)", 
      answer3: "ceil(x, y)",
    },
    8:  {
      question: "How can you add a comment in a JavaScript?",
      answer1: "'This is a comment",
      correctAnswer: "//This is a comment", 
      answer2: "<!--This is a comment-->",
    },
    9:  {
      question: "How do you round the number 7.25, to the nearest integer?",
      answer1: "Math.rnd(7.25)",
      answer2: "rnd(7.25)",
      correctAnswer: "Math.round(7.25)",  
      answer3: "round(7.25)",  
      }
    },
    jQuery_Quiz: {
    0: {
      question: "Given the input $(“span”). What does it select?",
      answer1: "The first span element",
      answer2: "The last span element",
      correctAnswer: "All span elements",
      answer3: "Element with the class 'span'",
    },
    1:   {
      question: "What scripting language is jQuery written in?",
      answer1: "VBScript",
      answer2: "C++",
      correctAnswer: "JavaScript",
      answer3: "Java",   
    },
    2: {
      question: "What is the jQuery method to set one or more style properties for selected elements?",
      answer1: "style()",
      answer2: "html()",
      correctAnswer: "css()",   
    },
    3: {
      question: "When referencing an HTML element preceded by a # (pound or hash), what javascript function is this equivalent to?",
      answer1: "getElementByClassName",
      correctAnswer: "getElementById",
      answer2: "getElementByTagName",
    },
    4:  {
      question: "Which jQuery method is used to switch between adding/removing one or more classes (for CSS) from selected elements?",
      answer1: "switchClass()",
      answer2: "addRemoveClass()",
      answer3: "altClass()",
      correctAnswer: "toggleClass()",   
    },
    5:  {
      question: "Given the input $(“span.intro”). What does it select?",
      correctAnswer: "All span elements with class=”intro”",
      answer1: "All span elements with id=”intro”",
      answer2: "The first span element with id=”intro”",
      answer3: "The first span element with class=”intro”",   
    },
    6:  {
      question: "What is the jQuery method to hide selected elements?",
      answer1: "visible(false)",
      answer2: "hidden()",
      answer3: "display(none)",
      correctAnswer: "hide()",   
    },
    7:  {
      question: "What is the jQuery method is used to perform an asynchronous HTTP request?",
      answer1: "jQuery.ajaxAsync()",
      answer2: "jQuery.ajaxSetup()",
      correctAnswer: "jQuery.ajax()", 
    },
    8:  {
      question: "What is the jQuery code to set the background color of all span elements to blue?",
      answer1: "$(“span”).style(“background-color”,”blue”);",
      correctAnswer: "$(“span”).css(“background-color”,”blue”);", 
      answer2: "$(“span”).layout(“background-color”,”blue”);",
      answer3: "$(“span”).manipulate(“background-color”,”blue”);",
    },
    9:  {
      question: "Is jQuery a library for client scripting or server scripting?",
      answer1: "Server scripting",
      correctAnswer: "Client scripting",  
      }
    },
    AJAX_Quiz: {
    0: {
      question: "What makes Ajax unique?",
      answer1: "It uses C++ as its programming language.",
      answer2: "It works as a stand-alone Web-development tool.",
      correctAnswer: "It makes data requests asynchronously.",
      answer3: "It works the same with all Web browsers.",
    },
    1:   {
      question: "What is AJAX based on?",
      answer1: "JavaScript and XML",
      answer2: "VBScript and XML",
      correctAnswer: "JavaScript and Java",
      answer3: "JavaScript and HTTP requests",   
    },
    2: {
      question: "What sever support AJAX?",
      answer1: "SMTP",
      answer2: "SMPP",
      answer3: "WWW",
      correctAnswer: "HTTP",   
    },
    3: {
      question: "What does the XMLHttpRequest object accomplish in Ajax?",
      answer1: "It provides a means of exchanging structured data between the Web server and client.",
      correctAnswer: "It provides the ability to asynchronously exchange data between Web browsers and a Web server.",
      answer2: "It's the programming language used to develop Ajax applications.",
      answer3: "It provides the ability to mark up and style the display of Web-page text.",   
    },
    4:  {
      question: "JSON stands for what?",
      answer1: "The code name for the next release of Prototype",
      answer2: "The code name for the next JavaScript API Release",
      answer3: "stands for JavaScript Over Network",
      correctAnswer: "stands for JavaScript Object Notation",   
    },
    5:  {
      question: "What is the average depth of the Earth's oceans?",
      correctAnswer: "12,200 ft",
      answer1: "5,800 ft",
      answer2: "2,400 ft",
      answer3: "21,000 ft",   
    },
    6:  {
      question: "Which one of these technologies is NOT used in AJAX?",
      answer1: "CSS",
      answer2: "DOM",
      answer3: "DHTML",
      correctAnswer: "Flash",   
    },
    7:  {
      question: "AJAX was made popular by who?",
      answer1: "Microsoft",
      answer2: "IBM",
      correctAnswer: "Google", 
      answer3: "Sun Microsystem",

    },
    8:  {
      question: "AJAX is a programming language",
      answer1: "True",
      correctAnswer: "False", 
    },
    9:  {
      question: "What are the advantages of AJAX?",
      answer1: "AJAX is a platform-independent technology",
      answer2: "It provides partial-page updates",
      answer3: "Improved performance",  
      correctAnswer: "All of the above",  
      }
    },
    Node_Quiz: {
    0: {
      question: "Which of following command starts a REPL session?",
      answer1: "$ node start",
      answer2: "$ node repl",
      correctAnswer: "$ node",
      answer3: "$ node console",
    },
    1:   {
      question: "Which of the following provides in-built events?",
      answer1: "handler",
      answer2: "callback",
      correctAnswer: "events",
      answer3: "throw",   
    },
    2: {
      question: "Which of the following is true about Piping streams?",
      answer1: "Piping is a mechanism where we provide output of one stream as the input to another stream.",
      answer2: "Piping is normally used to get data from one stream and to pass output of that stream to another stream.",
      answer3: "There is no limit on piping operations.",
      correctAnswer: "All of the above.",   
    },
    3: {
      question: "Which method of fs module is used to delete a file?",
      answer1: "fs.delete(fd, len, callback)",
      answer2: "fs.remove(fd, len, callback)",
      correctAnswer: "fs.unlink(path, callback)",
      answer3: "None of the above.",   
    },
    4:  {
      question: "Which of the following is the correct way to get an absolute path?",
      answer1: "os.resolve('main.js')",
      answer2: "fs.resolve('main.js')",
      correctAnswer: "path.resolve('main.js')",
      answer3: "None of the above", 
    },
    5:  {
      question: "Which of the following is true about internal binding with respect to domain module?",
      correctAnswer: "Error emmitter is executing its code within run method of a domain.",
      answer1: "Error emmitter is added explicitly to a domain using its add method.",
      answer2: "Both of the above.",
      answer3: "None of the above",   
    },
    6:  {
      question: "Which of the following module is required to create a web server?",
      answer1: "url module",
      answer2: "net module",
      answer3: "web module",
      correctAnswer: "http module",   
    },
    7:  {
      question: "Which of the following is true about RESTful webservices?",
      answer1: "100",
      answer2: "400",
      correctAnswer: "1400", 
      answer3: "1000",

    },
    8:  {
      question: "Which of the following is true about RESTful webservices?",
      answer1: "Webservices based on REST Architecture are known as RESTful web services.",
      answer2: "Webservices uses HTTP methods to implement the concept of REST architecture.",
      correctAnswer: "Both of the above.", 
      answer3: "None of the above.",
    },
    9:  {
      question: "What is the use of Underscore Variable in REPL session?",
      answer1: "To get the last command used.",
      answer2: "To store the result.",
      correctAnswer: "To get the last result.",  
      answer3: "None of the above",  
      }
    },
    mySQL_Quiz: {
    0: {
      question: "MySQL runs on which operating systems?",
      answer1: "Linux and Mac OS-X only",
      answer2: "Any operating system at all",
      correctAnswer: "Unix, Linux, Windows and others",
      answer3: "Unix and Linux only",
    },
    1:   {
      question: "To remove duplicate rows from the result set of a SELECT use the following keyword:",
      answer1: "NO DUPLICATE",
      answer2: "UNIQUE",
      correctAnswer: "DISTINCT",  
    },
    2: {
      question: "Which of the following can add a row to a table?",
      answer1: "Add",
      answer2: "Update",
      answer3: "Alter",
      correctAnswer: "Insert",   
    },
    3: {
      question: "Which SQL statement is used to insert a new data in a database?",
      answer1: "UPDATE",
      correctAnswer: "INSERT INTO",
      answer2: "ADD",
      answer3: "INSERT NEW",   
    },
    4:  {
      question: "Which function used to get the current time in mysql?",
      answer1: "Time()",
      answer2: "getTime()",
      correctAnswer: "NOW",   
    },
    5:  {
      question: "Which of the following is not a valid aggregate function?",
      correctAnswer: "COMPUTE",
      answer1: "MAX",
      answer2: "MIN",
      answer3: "COUNT",   
    },
    6:  {
      question: "What SQL clause is used to restrict the rows returned by a query?",
      answer1: "AND",
      answer2: "HAVING",
      answer3: "FROM",
      correctAnswer: "WHERE",   
    },
    7:  {
      question: "How many characters are allowed to create a database name?",
      answer1: "72",
      answer2: "55",
      correctAnswer: "64", 
      answer3: "40",

    },
    8:  {
      question: "MySQL Access security is controlled through?",
      answer1: "The ID that the user logged into the server through, and priveliges set up for that account.",
      correctAnswer: "MySQL login accounts, and priveliges set for each account", 
      answer2: "The normal login security is sufficient for MySQL, and it does not have any extra controls of its own.",
      answer3: "A table of valid IP addresses, and priveliges set up for each IP address",
    },
    9:  {
      question: "The USE command?",
      answer1: "Has been deprecated and should be avoided for security reasons",
      answer2: "Is a pseudonym for the SELECT command",
      correctAnswer: "Should be used to choose the database you want to use once you've connected to MySQL",  
      answer3: "Is used to load code from another file",  
      }
    },
    MongoDB_Quiz: {
    0: {
      question: "The architecture of a replica set affects the set’s _________ and capability.",
      answer1: "scalability",
      answer2: "performance",
      correctAnswer: "capacity",
    },
    1:   {
      question: "Which of the following format is supported by MongoDB?",
      answer1: "SQL",
      answer2: "XML",
      correctAnswer: "BSON",
      answer3: "JSON",   
    },
    2: {
      question: "MongoDB Queries can return specific fields of documents which also include user-defined __________ functions.",
      answer1: "Java",
      answer2: "C",
      answer3: "C++",
      correctAnswer: "JavaScript",   
    },
    3: {
      question: "MongoDB is a _________ database that provides high performance, high availability, and easy scalability.",
      answer1: "graph",
      correctAnswer: "document",
      answer2: "key value",
      answer3: "All of the above",   
    },
    4:  {
      question: "Dynamic schema in MongoDB makes ____________ easier for applications.",
      answer1: "Inheritance",
      answer2: "encapsulation",
      correctAnswer: "polymorphism",   
    },
    5:  {
      question: "With ________, MongoDB supports a complete backup solution and full deployment monitoring.",
      correctAnswer: "MMS",
      answer1: "AMS",
      answer2: "CMS",
      answer3: "DMS",   
    },
    6:  {
      question: "Point out the correct statement:",
      answer1: "MongoDB favours XML format more than JSON",
      answer2: "MongoDB is column oriented database store",
      correctAnswer: "MongoDB is classified as a NoSQL database",   
    },
    7:  {
      question: "After starting the mongo shell, your session will use the ________ database by default.",
      answer1: "mongo",
      answer2: "master",
      correctAnswer: "test", 
      answer3: "primary",

    },
    8:  {
      question: "Which of the following method is used to query documents in collections?",
      answer1: "move",
      correctAnswer: "find", 
      answer2: "shell",
      answer3: "replace",
    },
    9:  {
      question: "Which of the following method returns true if the cursor has documents?",
      answer1: "hasMethod()",
      answer2: "hasDoc()",
      correctAnswer: "hasNext()",  
      answer3: "All of the above",  
      }
    },
      ReactJS_Quiz: {
    0: {
      question: "ReactJS is developed by _____?",
      answer1: "Google Engineers",
      correctAnswer: "Facebook Engineers",

    },
    1:   {
      question: "ReactJS is an MVC based framework",
      answer1: "True",
      correctAnswer: "False",

    },
    2: {
      question: "JSX transformer is a MUST to work with ReactJS",
      answer1: "True",
      correctAnswer: "False",   
    },
    3: {
      question: "Which of the following concepts is/are key to ReactJS?",
      answer1: "Component-oriented design",
      answer2: "Event delegation model",
      correctAnswer: "Both of the above",
    },
    4:  {
      question: "ReactJS focuses on which of the following part when considering MVC?",
      answer1: "C (controller)",
      answer2: "M (model)",
      correctAnswer: "V (view)",   
    },
    5:  {
      question: "Which of the following needs to be updated to achieve dynamic UI updates?",
      correctAnswer: "State",
      answer1: "Props",
    },
    6:  {
      question: "Which of the following API is a MUST for every ReactJS component?",
      answer1: "getInitialState",
      answer2: "renderComponent",
      correctAnswer: "render",   
    },
    7:  {
      question: "'div' defined within render method is an actual DOM div element",
      answer1: "True",
      correctAnswer: "False", 
    },
    8:  {
      question: "Which of the following is used to pass the data from parent to child",
      answer1: "state",
      correctAnswer: "props", 
    },
    9:  {
      question: "A component in ReactJS could be composed of one or more inner components",
      correctAnswer: "True",
      answer1: "False",  
      }
    },
      Java_Quiz: {
    0: {
      question: "What of the following is the default value of a local variable?",
      answer1: "Null",
      answer2: "0",
      correctAnswer: "Not Assigned",
      answer3: "Depends upon the type of variable",
    },
    1:   {
      question: "What is the size of char variable?",
      answer1: "32 bit",
      answer2: "8 bit",
      correctAnswer: "16 bit",
      answer3: "64 bit",   
    },
    2: {
      question: "What is the default value of float variable?",
      answer1: "Not defined",
      answer2: "0",
      answer3: "0.0d",
      correctAnswer: "0.0f",   
    },
    3: {
      question: "Which of the following is true about super class?",
      answer1: "Variables, methods and constructors which are declared private can be accessed only by the members of the super class.",
      answer2: "Variables, methods and constructors which are declared protected can be accessed by any subclass of the super class.",
      answer3: "Variables, methods and constructors which are declared public in the superclass can be accessed by any class.",
      correctAnswer: "All of the above",   
    },
    4:  {
      question: "What is class variable?",
      answer1: "Class variables are static variables within a class but outside any method.",
      answer2: "Class variables are variables defined inside methods, constructors or blocks.",
      answer3: "Class variables are variables within a class but outside any method.",
      correctAnswer: "None of the above",   
    },
    5:  {
      question: "What is function overloading?",
      correctAnswer: "Methods with same name but different parameters.",
      answer1: "Methods with same name but different return types.",
      answer2: "Methods with same name, same parameter types but different parameter names.",
      answer3: "None of the above",   
    },
    6:  {
      question: "What is synchronization?",
      answer1: "Synchronization is the process of writing the state of an object to another object.",
      answer2: "Synchronization is the process of writing the state of an object to byte stream.",
      correctAnswer: "Synchronization is the capability to control the access of multiple threads to shared resources.",
      answer3: "None of the above",  
    },
    7:  {
      question: "What is a marker interface?",
      answer1: "Marker interface is an interface with single method, marker().",
      answer2: "Marker interface is an interface with single method, mark().",
      correctAnswer: "Marker interface is an interface with no method.", 
      answer3: "None of the above",

    },
    8:  {
      question: "Which arithmetic operations can result in the throwing of an ArithmeticException?",
      answer1: "* , +",
      correctAnswer: "/ , %", 
      answer2: "! , -",
      answer3: ">>, <<",
    },
    9:  {
      question: "Literals in java must be appended by which of these?",
      answer1: "L",
      answer2: "I",
      correctAnswer: "L and I",  
      answer3: "D",  
      }
    },
      CS_Quiz: {
    0: {
      question: "The brain of any computer system is",
      answer1: "ALU",
      answer2: "Memory",
      correctAnswer: "CPU",
      answer3: "Control unit",
    },
    1:   {
      question: "The binary system uses powers of",
      answer1: "8",
      answer2: "16",
      correctAnswer: "2",
      answer3: "10",   
    },
    2: {
      question: "A computer program that converts assembly language to machine language is",
      answer1: "Interpreter",
      answer2: "Comparator",
      answer3: "Compiler",
      correctAnswer: "Assembler",   
    },
    3: {
      question: "The time required for the fetching and execution of one simple machine instruction is",
      answer1: "Delay Time",
      correctAnswer: "CPU cycle",
      answer2: "Real Time",
      answer3: "Seek Time",   
    },
    4:  {
      question: "Any type of storage that is used for holding information between steps in its processing is",
      answer1: "Primary Storage",
      answer2: "CPU",
      answer3: "Internal Storage",
      correctAnswer: "Intermediate storage",   
    },
    5:  {
      question: "The section of the CPU that selects, interprets and sees to the execution of program instructions",
      correctAnswer: "Control unit",
      answer1: "Register Unit",
      answer2: "Memory",
      answer3: "ALU",   
    },
    6:  {
      question: "A single packet on a data link is known as",
      answer1: "Group",
      answer2: "Block",
      answer3: "Path",
      correctAnswer: "Frame",   
    },
    7:  {
      question: "A language which is close to that used within the computer is",
      answer1: "High-level Language",
      answer2: "Assembly Language",
      correctAnswer: "Low-Level Language", 
      answer3: "All of the above",

    },
    8:  {
      question: "Which is another name for functional language?",
      answer1: "Low-level language",
      correctAnswer: "Application language", 
      answer2: "High-level language",
      answer3: "Assembly language",
    },
    9:  {
      question: "Computer memory consists of",
      answer1: "RAM",
      answer2: "ROM", 
      answer3: "PROM",
      correctAnswer: "All of the above",  
      }
    },
      Python_Quiz: {
    0: {
      question: "What is the fastest fish in the ocean?",
      answer1: "Marlin",
      answer2: "Wahoo",
      correctAnswer: "Sailfish",
      answer3: "Tuna",
    },
    1:   {
      question: "What is the world's largest ocean?",
      answer1: "Atlantic",
      answer2: "Indian",
      correctAnswer: "Pacific",
      answer3: "Arctic",   
    },
    2: {
      question: "What percent of the oxygen we breathe is produced by the oceans?",
      answer1: "30%",
      answer2: "50%",
      answer3: "90%",
      correctAnswer: "70%",   
    },
    3: {
      question: "This is the largest animal on earth:",
      answer1: "Humpback Whale",
      correctAnswer: "Blue Whale",
      answer2: "Whale Shark",
      answer3: "Sperm Whale",   
    },
    4:  {
      question: "What percent of the Earth's surface is covered by oceans?",
      answer1: "82%",
      answer2: "65%",
      answer3: "87%",
      correctAnswer: "71%",   
    },
    5:  {
      question: "What is the average depth of the Earth's oceans?",
      correctAnswer: "12,200 ft",
      answer1: "5,800 ft",
      answer2: "2,400 ft",
      answer3: "21,000 ft",   
    },
    6:  {
      question: "What percent of humans live on the coast?",
      answer1: "70%",
      answer2: "50%",
      answer3: "40%",
      correctAnswer: "80%",   
    },
    7:  {
      question: "Green turtles can migrate more than _____ miles to lay their eggs.",
      answer1: "100",
      answer2: "400",
      correctAnswer: "1400", 
      answer3: "1000",

    },
    8:  {
      question: "Life began in the seas how long ago?",
      answer1: "1 BYA",
      correctAnswer: "3.2 BYA", 
      answer2: "750 MYA",
      answer3: "5 BYA",
    },
    9:  {
      question: "How many hearts do octopus have?",
      answer1: "1",
      answer2: "2",
      correctAnswer: "3",  
      answer3: "4",  
      }
    },
      CSharp_Quiz: {
    0: {
      question: "What is the fastest fish in the ocean?",
      answer1: "Marlin",
      answer2: "Wahoo",
      correctAnswer: "Sailfish",
      answer3: "Tuna",
    },
    1:   {
      question: "What is the world's largest ocean?",
      answer1: "Atlantic",
      answer2: "Indian",
      correctAnswer: "Pacific",
      answer3: "Arctic",   
    },
    2: {
      question: "What percent of the oxygen we breathe is produced by the oceans?",
      answer1: "30%",
      answer2: "50%",
      answer3: "90%",
      correctAnswer: "70%",   
    },
    3: {
      question: "This is the largest animal on earth:",
      answer1: "Humpback Whale",
      correctAnswer: "Blue Whale",
      answer2: "Whale Shark",
      answer3: "Sperm Whale",   
    },
    4:  {
      question: "What percent of the Earth's surface is covered by oceans?",
      answer1: "82%",
      answer2: "65%",
      answer3: "87%",
      correctAnswer: "71%",   
    },
    5:  {
      question: "What is the average depth of the Earth's oceans?",
      correctAnswer: "12,200 ft",
      answer1: "5,800 ft",
      answer2: "2,400 ft",
      answer3: "21,000 ft",   
    },
    6:  {
      question: "What percent of humans live on the coast?",
      answer1: "70%",
      answer2: "50%",
      answer3: "40%",
      correctAnswer: "80%",   
    },
    7:  {
      question: "Green turtles can migrate more than _____ miles to lay their eggs.",
      answer1: "100",
      answer2: "400",
      correctAnswer: "1400", 
      answer3: "1000",

    },
    8:  {
      question: "Life began in the seas how long ago?",
      answer1: "1 BYA",
      correctAnswer: "3.2 BYA", 
      answer2: "750 MYA",
      answer3: "5 BYA",
    },
    9:  {
      question: "How many hearts do octopus have?",
      answer1: "1",
      answer2: "2",
      correctAnswer: "3",  
      answer3: "4",  
      }
    },
      Express_Quiz: {
    0: {
      question: "What is the fastest fish in the ocean?",
      answer1: "Marlin",
      answer2: "Wahoo",
      correctAnswer: "Sailfish",
      answer3: "Tuna",
    },
    1:   {
      question: "What is the world's largest ocean?",
      answer1: "Atlantic",
      answer2: "Indian",
      correctAnswer: "Pacific",
      answer3: "Arctic",   
    },
    2: {
      question: "What percent of the oxygen we breathe is produced by the oceans?",
      answer1: "30%",
      answer2: "50%",
      answer3: "90%",
      correctAnswer: "70%",   
    },
    3: {
      question: "This is the largest animal on earth:",
      answer1: "Humpback Whale",
      correctAnswer: "Blue Whale",
      answer2: "Whale Shark",
      answer3: "Sperm Whale",   
    },
    4:  {
      question: "What percent of the Earth's surface is covered by oceans?",
      answer1: "82%",
      answer2: "65%",
      answer3: "87%",
      correctAnswer: "71%",   
    },
    5:  {
      question: "What is the average depth of the Earth's oceans?",
      correctAnswer: "12,200 ft",
      answer1: "5,800 ft",
      answer2: "2,400 ft",
      answer3: "21,000 ft",   
    },
    6:  {
      question: "What percent of humans live on the coast?",
      answer1: "70%",
      answer2: "50%",
      answer3: "40%",
      correctAnswer: "80%",   
    },
    7:  {
      question: "Green turtles can migrate more than _____ miles to lay their eggs.",
      answer1: "100",
      answer2: "400",
      correctAnswer: "1400", 
      answer3: "1000",

    },
    8:  {
      question: "Life began in the seas how long ago?",
      answer1: "1 BYA",
      correctAnswer: "3.2 BYA", 
      answer2: "750 MYA",
      answer3: "5 BYA",
    },
    9:  {
      question: "How many hearts do octopus have?",
      answer1: "1",
      answer2: "2",
      correctAnswer: "3",  
      answer3: "4",  
    }
  },
};
checkZip();
}; //window On load