drop database sound_squad;
create database sound_squad;
use sound_squad;

SELECT * from user;
SELECT * FROM community;
SELECT * FROM comment;
SELECT * FROM concert_info where artist_num=1;

SELECT count( artist_genre ) as genreName from artists GROUP BY artist_genre;

SELECT COUNT(DISTINCT artist_genre) as genre_count FROM artists;

SELECT DISTINCT artist_genre FROM artists ORDER BY artist_genre;

SELECT * FROM squad_info;

select * from concert_info;

select count(concert_num) from concert_info;

use sound_squad;


desc concert_info;
