/*  
Script contributed by Michael Perkins
example usage:
cat load.sql | mysql -u root
(assumes user is in same directory as GTFS source files)
*/

CREATE DATABASE IF NOT EXISTS wmata_gtfs;

USE wmata_gtfs

/* 23feb18 rca added agency_lang  */
DROP TABLE IF EXISTS agency;

CREATE TABLE `agency` (
    agency_id int(11) PRIMARY KEY,
    agency_name VARCHAR(255),
    agency_url VARCHAR(255),
    agency_timezone VARCHAR(50),
    agency_lang VARCHAR(2)
);

/* 23feb18 rca service_id is a string  */
DROP TABLE IF EXISTS calendar;

CREATE TABLE `calendar` (
    service_id varchar(2),
	monday TINYINT(1),
	tuesday TINYINT(1),
	wednesday TINYINT(1),
	thursday TINYINT(1),
	friday TINYINT(1),
	saturday TINYINT(1),
	sunday TINYINT(1),
	start_date VARCHAR(8),	
	end_date VARCHAR(8),
	KEY `service_id` (service_id)
);

DROP TABLE IF EXISTS calendar_dates;

CREATE TABLE `calendar_dates` (
    service_id INT(11),
    `date` VARCHAR(8),
    exception_type INT(2),
    KEY `service_id` (service_id),
    KEY `exception_type` (exception_type)    
);

/* 23feb18 rca updated to the current fields in routes */
DROP TABLE IF EXISTS routes;

CREATE TABLE IF NOT EXISTS `routes` (
  `route_id` varchar(8) NOT NULL DEFAULT '0',
  `route_short_name` varchar(50) DEFAULT NULL,
  `route_long_name` varchar(255) DEFAULT NULL,
  `route_desc` varchar(40) NOT NULL,
  `route_type` int(2) DEFAULT NULL,
  `route_url` varchar(120) NOT NULL,
  `route_color` varchar(6) NOT NULL,
  `route_text_color` varchar(6) NOT NULL,
	KEY `route_type` (route_type)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS stop_times;
CREATE TABLE `stop_times` (
    trip_id INT(11),
	arrival_time VARCHAR(8),
	departure_time VARCHAR(8),
	stop_id INT(11),
	stop_sequence INT(11),
	stop_headsign varchar(50),
	pickup_type INT(2),
	drop_off_type INT(2),
	shape_dist_traveled double,
	KEY `trip_id` (trip_id),
	KEY `stop_id` (stop_id),
	KEY `stop_sequence` (stop_sequence),
	KEY `pickup_type` (pickup_type),
	KEY `drop_off_type` (drop_off_type)
);

DROP TABLE IF EXISTS stops;

CREATE TABLE `stops` (
  stop_id varchar(12) NOT NULL DEFAULT '0',
  stop_code char(12) DEFAULT NULL,
  stop_name varchar(255) DEFAULT NULL,
  stop_desc varchar(255) NOT NULL,
  stop_lat DECIMAL(8,6),
  stop_lon DECIMAL(8,6),
  zone_id int(11) NOT NULL,
  stop_url varchar(255) NOT NULL,
  location_type int(2) NOT NULL,
  parent_station varchar(12) DEFAULT NULL,
  stop_timezone varchar(200) DEFAULT NULL,
  wheelchair_boarding tinyint(1) DEFAULT 0,
  KEY `zone_id` (zone_id),
  KEY `stop_lat` (stop_lat),
  KEY `stop_lon` (stop_lon)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS trips;

CREATE TABLE `trips` (
    route_id varchar(8),
	service_id INT(11),
	trip_id INT(11) PRIMARY KEY,
	trip_headsign VARCHAR(255),
	direction_id TINYINT(1),
	block_id INT(11),
	KEY `route_id` (route_id),
	KEY `service_id` (service_id),
	KEY `direction_id` (direction_id),
	KEY `block_id` (block_id)
);

CREATE TABLE IF NOT EXISTS `logs` (
  `identifier` varchar(80) NOT NULL,
  `logtime` int(12) NOT NULL,
  `command` varchar(80) DEFAULT NULL,
  `route_id` varchar(8) DEFAULT NULL,
  `trip_id` varchar(10) DEFAULT NULL,
  `departure_time` varchar(9) DEFAULT NULL,
  `service_id` varchar(10) DEFAULT NULL,
  `stop_id` varchar(70) DEFAULT NULL
)ENGINE=MyISAM DEFAULT CHARSET=latin1; 

LOAD DATA LOCAL INFILE 'agency.txt' INTO TABLE agency FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'calendar.txt' INTO TABLE calendar FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'calendar_dates.txt' INTO TABLE calendar_dates FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'routes.txt' INTO TABLE routes FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'stop_times.txt' INTO TABLE stop_times FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'stops.txt' INTO TABLE stops FIELDS TERMINATED BY ',' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'trips.txt' INTO TABLE trips FIELDS TERMINATED BY ',' IGNORE 1 LINES;
