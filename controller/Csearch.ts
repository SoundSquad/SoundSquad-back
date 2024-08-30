import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';

dotenv.config();

//testapi 아직 개발되지 않은 api의 endpoint, 요청이 제대로 도달하는지 확인 가능
export const testApi = async (req: Request, res: Response) => {
  try {
    console.log('req >>>> ', req);
    
  } catch (err) {
    console.error(err);
  }
};

export const searchArtist = async (req: Request, res: Response) => {
  try {
    const artist_name = req.query.artist_name as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!artist_name) {
      return res.status(400).json({ msg: '검색어를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.Artists.findAndCountAll({
      where: {
        artist_name: {
          [Op.like]: `%${artist_name}%`
        }
      },
      attributes: ['artist_name', 'artist_num', 'artist_profile', 'artist_genre'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'artists');

    return res.status(200).json({ msg: 'artist 목록을 성공적으로 불러왔습니다.', data: result });

  } catch (err) {
    console.error('artist 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'artist 검색 중 오류가 발생했습니다.' });
  }
};

export const searchCategory = async( req : Request, res : Response )=>{
  try{
    const category_name = req.query.category_name as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!category_name) {
      return res.status(400).json({ msg: '검색어를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.Artists.findAndCountAll({
      where: {
        artist_genre: {
          [Op.like]: `%${category_name}%`
        }
      },
      attributes: ['artist_name', 'artist_num', 'artist_profile', 'artist_genre'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'artists');

    return res.status(200).json({ msg: 'artist 목록을 성공적으로 불러왔습니다.', data: result });

  }catch(err){
    console.error('category 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'category 검색 중 오류가 발생했습니다.' });
  }
}