/*
 * Author: Project #1 Fire
 * Project Name: Project Fire GitHub API Search
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */

//  GitHub API Source <script src = "https://unpkg.com/github-api/dist/GitHub.min.js" > < /script>


window.onload = function () {
    // Variables - Global definition to use
    var topic = '';
    var results;

    // onClick - submit search input 
    $('#searchButton').on('click', function (event) {
        event.preventDefault(event);

        // Empty current content
        $('#gitHolder').empty();
        $('#noResults').empty();

        // If - 
        if ($('input:text').val().trim() != '') {
            // Variable - defines search input as topic
            var topic = $('input:text').val().trim();
            // Pass into getGitHub function
            getGitHub();
            // Clear search input text
            $('input:text').val('');
        };
    });


    var apiGitHub = 'https://api.github.com/search/repositories?q=topic:tutorials';
    var queryTopic = '&topic:' + $('#topic:text');
    var queryLanguage = '&language:' + $('#language:text');

    let getGitHub = function () {
        var queryURL = apiGitHub + queryTopic + queryLanguage;
        
        $.get(queryUrl, function(data) {
            var results = data.results;

            if (data.code === 'badtopic' || results.length === 0) {
                topic = 'javascript'
                queryURL = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';

                $.getJSON(queryUrl, null, function (data) {
                    results = data.results;
                    $('#noResults').html('We couldnt find any meetups meeting your search criteria. Heres a few others you may be interested in:' + '<br>' + '<br>')
                    displayGit();
                });           
            } else {
                displayGit();
            };

        });
    };

    let displayGit = function () {
        for (var i = 0; i < results.length; i++) {
            var meetUpDiv = $('<div>');
            var p = $('<p>');
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

            p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
            meetUpDiv.append(p);
            meetUpDiv.append(img);
            $('#meetUpPanel').append(meetUpDiv);
            $('#meetUpPanel').append(link);


        }
    };
};