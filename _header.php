<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Apache2 Ubuntu Default Page: It works</title>
<link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="main_page">
      <div class="page_header floating_element">
        <span class="floating_element">
          My Bus Routes Home Page
        </span>
      </div>
        <div class="section_header section_header_grey">
          Example page links
        </div>
        <div class="table_of_contents_item floating_element">
<a href= "get-buses.php?stop_id=34314">Stop: Union station </a></li>
        </div>
        <div class="table_of_contents_item floating_element">
            <a href= "get-buses.php?rstop_id=33674" >stop: Coffman PnR (one stop)</a>
        </div>
        <div class="table_of_contents_item floating_element">
<a href="get-buses.php?stop_id=33528">Stop: Brooomfield Station 33528</a> 
        </div>
        <div class="table_of_contents_item floating_element">
<a href= "get-buses.php?stop_id=18107">stop: Hwy 119 & Hwy 52,Vehicles Travelling Southwest</a> 
        </div>
        <div class="table_of_contents_item floating_element">
<a href= "get-buses.php?stop_id=17996">stop: Hwy 119 & Hwy 52,Vehicles Travelling Northeast</a> 
        </div>
        <div class="table_of_contents_item floating_element">
<a href= "get-buses.php?stop_id= 15145">stop 17th and main soutbound</a> 
        </div>
        <div class="table_of_contents_item floating_element">
<a href="get-routes.php?route_id=BOLT">Route: BOLT</a> 
        </div>
        <div class="table_of_contents_item floating_element">
<a href="get-routes.php?route_id=120">Route: 120</a>
        </div>
        <div class="table_of_contents_item floating_element">
hmmm </div>
      <div class="content_section floating_element">


        <div class="section_header section_header_red">
          <div id="about"></div>
          It works!
        </div>
        <div class="content_section_text">
          <p>
This is the mobile bus route browser.
          </p>
<p>
This is a system for navigting a city bus schedule from a phone using google transit format 
information provided as CSV files, loaded into a MYSQL datbase and served via an apache
web server, written in php, but will have javascript soon. 
          </p>
<p>
This system takes the static information from 
<a href="http://www.rtd-denver.com/gtfs-developer-guide.shtml#realtime-feeds">
RTD website </a>
          </p>
<p>
This tries to answer some basic questions:
<ul><li>where am I ? if you can give me a number from a RTD stop, i can show
you where you are on a map because i have the lat/long
</li><li> what buses can i take from here? I can tell you what routes you can take from
where you are standing provided you can either select the place from a dropdown list 
or enter the 5 digit stop code that is written on every bus stop sign in the city. 
</li><li> what other stops are near me?  given either a GPS coordinate somehow (parse them out 
a pasted URL or text if needed) or again, provided the 5 digit bus stop code, 
we can select from the database based on the lat/lon values in our database. 
</li><li> what routes can i catch from each of those? this is an iterated version of the previous question 
about what buses leave form here. By clicking in, you can iterate from stop to trip to stop.
</li><li> where have i been - if you ientify with the system, we'll keep track of the stops you've 
directly asked about, what routes you've asked about.  
</li> </ul>
When you ask for a list of routes or stops, by default we'll only show the ones you know. 
</p>

######################

        </div>
        <div class="section_header">
Meet the pages
 </div>  
  
        <div class="content_section_text">
          <p>
                The configuration layout for an Apache2 web server installation on Ubuntu systems is as follows:
          </p>

##########################

<p>
<a href="get-buses.php">get-buses.php</a> This is the page I wanted to 
write when I started this project. Given the 5 digit stop code, gives all the runs that go to this stop. 
<br/>
params in: 
stop number
departure_time

</p>
<p>
<a href="get-routes.php">get-routes.php</a> 
2. get-routes.php - page that lists routes.  
Params in: 
route_id - default to BOLT if none is given;
link:to full  details about a particular route on the RTD website

</p>
<p>
<a href="get-stops.php">get-stops.php</a> 
3. get-stops - page that lists all/faorite stops.
- checkbox toggles all vs fave stops;
- stop linis to the bustimesatstop;

</p>
<p>
<a href="get-routedetails.php">get-routedetails.php</a> 
4. get-routedetails - full route details page  
list of the runs, so you can see all the stops on a particular 
link to next run of a route
</p>
<p>
<a href="get-buses.php">get-buses.php</a> 
5. get-trips.php - 
Param in trip_id
departure_time

</p>



      </div>
    </div>
    <div class="validator">
validator:
    </div>
  </body>
</html>

##################################
includes:
<li>header.php - set the keywords and no cache and stuff, set up the title to 
something useful if it's bookmarked
</li>

<li>
footer.php that includes the range of dates that these schedules are 
valid from the database
</li>

routines:
get-service_id - give a date, or today if blank, return whether today is a 
WK 
SAturday
SUnday/holiday

static information that you build once and stash in a file
- rtd denver
- stuff about author


