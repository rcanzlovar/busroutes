
SELECT  
r.route_short_name as route_short_name,
r.route_long_name  as route_long_name,
r.route_id         as route_id,
r.route_color      as route_color,
r.route_text_color as route_text_color,



s.stop_desc        as stop_desc, 
s.stop_name        as stop_name,  
s.stop_id          as stop_id,  
s.stop_lat         as stop_lat,  
s.stop_lon         as stop_lon,  
t.service_id       as service_id,  
t.trip_headsign    as trip_headsign,
t.trip_id          as trip_id,
t.service_id       as service_id,
st.stop_sequence   as stop_sequence,
st.arrival_time    as arrival_time,
st.departure_time  as departure_time 
 FROM trips t, stop_times st, routes r, stops s 
 WHERE t.route_id = 'BOLT'  AND t.trip_id = st.trip_id  AND s.stop_id = st.stop_id  AND r.route_id = t.route_id 

AND st.departure_time > subtime(curtime(), "0:20:0") AND st.departure_time < addtime(curtime(), "5:00:00") 


AND t.service_id in ("FR","WK")  ORDER BY t.trip_id,st.stop_sequence



ALTER TABLE stops CONVERT TO CHARACTER SET latin1 COLLATE 'utf8_unicode_ci';`

utf8_unicode_ci
