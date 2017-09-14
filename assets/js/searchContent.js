/*
 * Author: Project #1 Fire
 * Project Name: Project Fire custom page JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */

$(document).ready(function () {

    // Variable - Array for search topics
    var topics = [];

    // Function - API search return
    // function searchContent() {
    // Variable - Search input definition for API
    //   var searchInput = $(this).data("search");
    //   console.log(searchInput);
    // 
    // 
    // Variable - API retreval, definition, and search
    //   var getAPI = $.get("");
    //   
    //   getAPI.done(function (response) {
    //     var status = getAPI.statusText;
    //     console.log("API Pull: " + status);
    //     var results = response.data;
    //     console.log("Results:", results);
    // 
    // for (var i = 0; i < results.length; i++) {
    //   });
    // 
    // END - getAPI.done(function (response) 
    // };
    // END - function searchContent()


    // Function - Generates tabs of search input submitted
    function searchTab() {
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
            // Text to showTab - displays search input on showTab
            tabAncr.text(topics[i]);
            // Variable - Button to delete search tab
            var tabButton = $("<button type='button' class='close'>&times;</button>");
            // Append with tabAncr - id="myTab"
            searchTab.append(tabAncr);
            // Append with tabButton - id="myTab"
            searchTab.append(tabButton);
        }

        // Append with searchTab - id="myTab"
        $("#myTab").append(searchTab);

        // Append with contentDiv - id="myTabContent"
        $("#myTabContent").append(contentDiv);

    };
    // END - function searchTab()

    
    // onClick - Button id="searchButton" runs function searchTab and searchContent
    $("#searchButton").on("click", function (event) {
        event.preventDefault();

        var newSearch = $("#searchInput").val().trim();

        // Push - newSearch into topics array
        topics.push(newSearch);
        console.log("Search topic:", topics);

        // Clear text input of id="searchInput"
        $("#searchInput").val("");
        // Run Function - Displays search input as button
        searchTab();
    });
    // END - $("#searchButton").on("click", function (event)
});