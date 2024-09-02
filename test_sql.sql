drop database sound_squad;
create database sound_squad;
use sound_squad;

SELECT * from user;
SELECT * FROM community;
SELECT * FROM comment;
SELECT * FROM concert_info where artist_num=1;
SELECT * from artists limit 3;

select * from concert_info;

select count(concert_num) from concert_info;

use sound_squad;


desc concert_info;
