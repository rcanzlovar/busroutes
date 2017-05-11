
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
-- table to track the selections made as people
-- use the system, using their ip address as key
-- tried password encruption but that didn't give
-- a consistent value. still want to make hash 
-- from the ip address

--
--

-- --------------------------------------------------------

DROP TABLE IF EXISTS `logs`;

CREATE TABLE IF NOT EXISTS `logs` (
  `identifier` varchar(80) NOT NULL,
  `logtime` int(12) NOT NULL,
  `command` varchar(80),
  `route_id` varchar(80),
  `trip_id` varchar(10),
  `departure_time` varchar(9),
  `service_id` varchar(10) ,
  `stop_id` varchar(70)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


