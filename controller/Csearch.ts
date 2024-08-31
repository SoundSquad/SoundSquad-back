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

/** 검색 1. 아티스트에 대한 키워드 검색
 * get : /search/artist 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
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

/** 검색 2. 공연에 대한 키워드 검색 요청
 * get : /search/concert 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const searchConcert = async (req: Request, res: Response) => {
  try {
    const concert_title = req.query.concert_title as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!concert_title) {
      return res.status(400).json({ msg: '검색어를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.ConcertInfo.findAndCountAll({
      where: {
        concert_title: {
          [Op.like]: `%${concert_title}%`
        }
      },
      attributes: ['concert_title', 'concert_num', 'concert_image', 'artist_id', 'start_date', 'concert_location', 'concert_genre' ],
      include: [{
        model: db.Artists,
        attributes: ['artist_name'],
      }],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'concerts');

    return res.status(200).json({ msg: 'concert 목록을 성공적으로 불러왔습니다.', data: result });

  } catch (err) {
    console.error('artist 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 검색 중 오류가 발생했습니다.' });
  }
};

/** 검색 3. 카테고리 검색 - 아티스트
 *  get : /search/category/artist 의 도달점
 * @param req 
 * @param res 
 * @returns 
 */
export const searchCategoryArtist = async( req : Request, res : Response )=>{
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
/** 검색 4 . 카테고리로 공연 검색
 *  get : /search/category/concert 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const searchCategoryConcert = async( req : Request, res : Response )=>{
  try{
    const category_name = req.query.category_name as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!category_name) {
      return res.status(400).json({ msg: '검색어를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.ConcertInfo.findAndCountAll({
      where: {
        concert_genre: {
          [Op.like]: `%${category_name}%`
        }
      },
      include: [{
        model: db.Artists,
        attributes: ['artist_name'],
      }],
      attributes: ['concert_name', 'concert_num', 'concert_image', 'artist_genre'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'concerts');

    return res.status(200).json({ msg: 'concert 목록을 성공적으로 불러왔습니다.', data: result });

  }catch(err){
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}

/** 공연의 상세 정보
 * get : /search/datail/concert
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetailConcert = async ( req : Request, res : Response )=>{
  try {
    const concert_num = parseInt(req.query.concert_num as string) || undefined;
    
    if(!concert_num){
      return res.status(400).json({ msg: '요청 대상이 잘못되었습니다.' });
    }

    const result = await db.ConcertInfo.findOne({
      where:{ concert_num },
      attributes:[]
    });

  }catch (err) {
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}

/** 공연 상세정포 페이지의 스쿼드
 * get : /search/datail/concert/squad
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetailConcertSquad = async ( req : Request, res : Response )=>{
  try {
    
  }catch (err) {
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}

/** 아티스트의 상세 정보
 * get : /search/detail/artist
 *  
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetailArtist = async ( req : Request, res : Response )=>{
  try {
    
  }catch (err) {
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}

/** 아티스트 상세정보 페이지의 리뷰 요청
 * get : /search/detail/artist/review
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetailArtistReview = async ( req : Request, res : Response )=>{
  try {
    
  }catch (err) {
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}
