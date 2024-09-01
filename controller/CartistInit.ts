import { Request, Response } from 'express';
import db from '../models';
import fs from 'fs';
import path from 'path';
import { ArtistAttributes, GenreDetail } from '../modules/APIs';
import logger from '../config/loggerConfig';


// genre detail info
const genreList:GenreDetail[] = [
    {name: 'Alternative', id: 'KnvZfZ7vAvv'},
    {name: 'Ballads-Romantic', id: 'KnvZfZ7vAve'},
    {name: 'Blues', id: 'KnvZfZ7vAvd'},
    {name: 'Chanson Francaise', id: 'KnvZfZ7vAvA'},
    {name: 'Childrens Music', id: 'KnvZfZ7vAvk'},
    {name: 'Classical', id: 'KnvZfZ7vAeJ'},
    {name: 'Country', id: 'KnvZfZ7vAv6'},
    {name: 'Dance-Electronic', id: 'KnvZfZ7vAvF'},
    {name: 'Folk', id: 'KnvZfZ7vAva'},
    {name: 'Hip-Hop-Rap', id: 'KnvZfZ7vAv1'},
    {name: 'Holiday', id: 'KnvZfZ7vAvJ'},
    {name: 'Jazz', id: 'KnvZfZ7vAvE'},
    {name: 'Latin', id: 'KnvZfZ7vAJ6'},
    {name: 'Metal', id: 'KnvZfZ7vAvt'},
    {name: 'New Age', id: 'KnvZfZ7vAvn'},
    {name: 'Other', id: 'KnvZfZ7vAvl'},
    {name: 'Pop', id: 'KnvZfZ7vAev'},
    {name: 'R&B', id: 'KnvZfZ7vAee'},
    {name: 'Reggae', id: 'KnvZfZ7vAed'},
    {name: 'Religious', id: 'KnvZfZ7vAe7'},
    {name: 'Rock', id: 'KnvZfZ7vAeA'},
    {name: 'Undefined', id: 'KnvZfZ7vAe6'},
    {name: 'World', id: 'KnvZfZ7vAeF'},
];

const getArtistsInit = async (req: Request, res: Response) => {
    try {
        
        logger.info('서버 기동 요청 - db1 ');
        
        let initStatus:any = await db.Artists.findOne({ where : { artist_num : 1},attributes:['artist_num']});
        if(initStatus){
            logger.error('getArtistsInit - 400 ');
            return res.status(400).json({ msg : '기동이 이미 완료되었습니다.' });
        }

        let bulkArtists: ArtistAttributes[] = [];
        for (const genre of genreList) {
            const readJsonFilePath = path.join(__dirname, `../public/artists_0828/artists_${genre.name}.json`);
            const jsonFile = fs.readFileSync(readJsonFilePath, 'utf-8');
            const jsonData = JSON.parse(jsonFile) as any[];

            const artistsWithGenre: ArtistAttributes[] = jsonData.map(artist => ({
                artist_id: artist.artist_id,
                artist_name: artist.artist_name,
                artist_profile: artist.artist_profile,
                profile_click: 0,
                artist_desc: artist.artist_desc || '',
                artist_genre: genre.name,
            }));

            bulkArtists.push(...artistsWithGenre);
        }

        const artists = await db.Artists.bulkCreate(bulkArtists, {
            updateOnDuplicate: ['artist_name', 'artist_profile', 'artist_desc', 'artist_genre'],
        });
        
        logger.info('getArtistsInit - 201 ');
        return res.status(201).json({ success: true, message: "Artists initialized successfully", count: artists.length });
        
    } catch (err) {
        logger.error('getArtistsInit - 500 ');
        console.error('Error initializing artists:', err);
        return res.status(500).json({ success: false, message: "An error occurred while initializing artists" });
    }
}

export default getArtistsInit;