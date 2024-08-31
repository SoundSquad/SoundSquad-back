import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import db from '../models';
import { ArtistEventData } from '../modules/APIs';

export const getConcertInit = async (req: Request, res: Response) => {
  try {
    console.log('서버 기동요청');
    let initStatus:any = await db.ConcertInfo.findOne({ where : { concert_num : 1}, attributes:['concert_num']});
    console.log(initStatus);
    
    if(initStatus){
      return res.status(400).json({ msg : '기동이 이미 완료되었습니다.' });
    }

    const concertDir = path.join(__dirname, '../public/concert');
    const files = await fs.readdir(concertDir);

    for (const file of files) {
      if (file.endsWith('_events.json')) {
        const artistId = parseInt(file.split('_')[1]);
        const filePath = path.join(concertDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data: ArtistEventData = JSON.parse(fileContent);

        const artist = await db.Artists.findOne({ where: { artist_num: artistId } });
        
        if (!artist) {
          console.warn(`Artist not found for artist_id: ${artistId}`);
          continue;
        }

        const concertData = data.events.map(event => ({
          artist_num: artistId,
          concert_title: event.title,
          start_date: new Date(event.start_date),
          end_date: new Date(event.end_date),
          concert_image: event.image_url,
          concert_genre: artist.artist_genre,
          concert_location: event.location,
          concert_detail: event.description,
          ticket_link: event.ticket_link
        }));

        await db.ConcertInfo.bulkCreate(concertData);

        console.log(`Imported concerts for artist_id: ${artistId}`);
      }
    }

    res.status(200).json({ message: "Concert data import completed successfully" });
  } catch (error) {
    console.error('Error importing concert data:', error);
    res.status(500).json({ message: "An error occurred while importing concert data", error: (error as Error).message });
  }
};

export default getConcertInit;