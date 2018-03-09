# My Bua Routes

## What is this?

This is da system for navigting a city bus schedule from a phone using google transit format  (GTFS)
information provided as CSV files, loaded into a MYSQL datbase and 
served via an apache
web server. This was originally a PHP CGI app written in PHP. 
The current implementaton uses JavaScript REST API. The server piece just reads the database and  writes out JSON, which is interpreted and 
displayed by the client, written in Javascript. 


This system takes the static information from RTD website 
http://www.rtd-denver.com/gtfs-developer-guide.shtml#realtime-feeds

This tries to answer some basic questions:
- Where am I ? if you can give me a number from a RTD stop, i can show
you where you are on a map because i have the lat/long
- What buses can i take from here? I can tell you what routes you can take from
where you are standing provided you can either select the place from a dropdown list 
or enter the 5 digit stop code that is written on every bus stop sign in the city. 
- What other stops are near me?  given either a GPS coordinate somehow (parse them out 
a pasted URL or text if needed) or again, provided the 5 digit bus stop code, 
we can select from the database based on the lat/lon values in our database. 
- What routes can i catch from each of those? this is an iterated version of the previous question 
about what buses leave form here. By clicking in, you can iterate from stop to trip to stop.
- Where have i been - if you ientify with the system, we'll keep track of the stops you've 
directly asked about, what routes you've asked about.  
When you ask for a list of routes or stops, by default we'll only show the ones you know. 

##########################
1. get-buses.php -  page that gives all the runs that go to this stop. 
params in: 
stop number
departure_time


2. get-routes.php - page that lists routes - 
Params in: 
route_id - default to BOLT if none is given
link:to full  details about a particular route on the RTD website

3. get-stops - page that lists all/faorite stops - 
- checkbox toggles all vs fave stops
- stop linis to the bustimesatstop

4. get-routedetails - full route details page  
list of the runs, so you can see all the stops on a particular 
link to next run of a route

5. get-trips.php - 
Param in trip_id
departure_time

##################################
includes:
header - set the keywords and no cache and stuff, set up the title to 
something useful if it's bookmarked

footer.php that includes the range of dates that these schedules are 
valid from the database

get-service_id - give a date, or today if blank, return whether today is a 
WK 
SAturday
SUnday/holiday

static information that you build once and stash in a file
- rtd denver
- stuff about author


