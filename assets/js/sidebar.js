/*
 * Author: Project #1 Fire
 * Project Name: Project Fire sidbar JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */

$('.sidebar').on('click', function(event) {
	event.preventDefault();
	$(this).toggleClass("open");
});