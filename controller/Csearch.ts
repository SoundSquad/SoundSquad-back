import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';
import { updateCountA } from '../modules/Martists'
import { updateCountC } from '../modules/MconcertInfo';
import logger from '../config/loggerConfig';

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
        
    if (!artist_name || typeof artist_name !== 'string' || artist_name.trim() === '') {
      logger.error(' searchArtist - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 아티스트 이름을 입력해주세요' });
    }
    if (isNaN(page) || page < 1 || !pageSize) {
      logger.error(' searchArtist - 400 ');
      return res.status(400).json({ msg: '유효한 페이지 정보를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.Artists.findAndCountAll({
      where: {
        artist_name: {
          [Op.like]: `%${artist_name}%`
        }
      },
      include: [{
        model: db.ConcertInfo,
        attributes: ['concert_num', 'concert_title', 'start_date'],
        required: false,  // LEFT OUTER JOIN
      }],
      attributes: [
        'artist_name',
        'artist_num', 
        'artist_profile', 
        'artist_genre'
      ],
      order: [[db.ConcertInfo, 'start_date', 'DESC']],
      offset,
      limit: pageSize,
      subQuery: false,
      distinct: true,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error(' searchArtist - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'artists');

    logger.info(' searchArtist - 200 ');
    return res.status(200).json({ msg: 'artist 목록을 성공적으로 불러왔습니다.', data: result });

  } catch (err) {
    logger.error(' searchArtist - 500 ');
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

    if (!concert_title || typeof concert_title !== 'string' || concert_title.trim() === '') {
      logger.error(' searchConcert - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 공연 제목을 입력해주세요' });
    }
    
    if (isNaN(page) || page < 1 || !pageSize ) {
      logger.error(' searchConcert - 400 ');
      return res.status(400).json({ msg: '유효한 페이지 정보를 입력해주세요' });
    }
    
    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.ConcertInfo.findAndCountAll({
      where: {
        concert_title: {
          [Op.like]: `%${concert_title}%`
        }
      },
      include: [{
        model: db.Artists,
        attributes: ['artist_name'],
        required: false,
      }],
      attributes: ['concert_title', 'concert_num', 'concert_image', 'artist_num', 'start_date', 'concert_location', 'concert_genre' ],
      order: [['start_date', 'DESC']],
      offset,
      limit: pageSize,
      distinct: true,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error(' searchConcert - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'concerts');

    logger.info(' searchConcert - 200 ');
    return res.status(200).json({ msg: 'concert 목록을 성공적으로 불러왔습니다.', data: result });

  } catch (err) {
    logger.error(' searchConcert - 500 ');
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
    const category_name = req.query.genre_name as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!category_name || typeof category_name !== 'string' || category_name.trim() === '') {
      logger.error(' searchCategoryArtist - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 카테고리 이름을 입력해주세요' });
    }
    
    if (isNaN(page) || page < 1 || !pageSize) {
      logger.error(' searchCategoryArtist - 400 ');
      return res.status(400).json({ msg: '유효한 페이지 정보를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const vCategory = category_name.replace(/[%_\\]/g, '\\$&');

    const { count, rows } = await db.Artists.findAndCountAll({
      where: {
        artist_genre: {
          [Op.like]: `%${vCategory}%`
        }
      },
      attributes: ['artist_name', 'artist_num', 'artist_profile', 'artist_genre'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error(' searchCategoryArtist - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'artists');

    logger.info(' searchCategoryArtist - 200 ');
    return res.status(200).json({ msg: 'artist 목록을 성공적으로 불러왔습니다.', data: result });

  }catch(err){
    logger.error(' searchCategoryArtist - 500 ');
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
    const category_name = req.query.genre_name as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
        
    if (!category_name || typeof category_name !== 'string' || category_name.trim() === '') {
      
      logger.error(' searchCategoryConcert - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 카테고리 이름을 입력해주세요' });
    }

    if (isNaN(page) || page < 1 || !pageSize ) {
      logger.error(' searchCategoryConcert - 400 ');
      return res.status(400).json({ msg: '유효한 페이지 번호를 입력해주세요' });
    }
    const vCategory = category_name.replace(/[%_\\]/g, '\\$&');

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.ConcertInfo.findAndCountAll({
      where: {
        concert_genre: {
          [Op.like]: `%${vCategory}%`
        }
      },
      include: [{
        model: db.Artists,
        attributes: ['artist_name'],
      }],
      attributes: ['concert_title', 'concert_num', 'concert_image', 'concert_genre'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error(' searchCategoryConcert - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'concerts');

    logger.info(' searchCategoryConcert - 200 ');
    return res.status(200).json({ msg: 'concert 목록을 성공적으로 불러왔습니다.', data: result });

  }catch(err){
    logger.error(' searchCategoryConcert - 500 ');
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
      logger.error(' getDetailConcert - 400 ', req.query );
      return res.status(400).json({ msg: '요청 대상이 잘못되었습니다.' });
    }

    const result = await db.ConcertInfo.findOne({
      where:{ concert_num },
      include: [{
        model: db.Artists,
        attributes: ['artist_name'],
      }],
    });

    logger.info(' getDetailConcert - 201 ');
    res.status(201).json({ msg : '데이터를 성공적으로 불러왔습니다.', data: result});
    
    // 응답 이후 조회수 증가
    const newCount = (result?.info_click ?? 0) + 1;

    const updateCountObj : updateCountC = {
      info_click : newCount
    }

    return await db.ConcertInfo.update( updateCountObj,{
      where:{ concert_num },
    });

  }catch (err) {
    logger.error(' getDetailConcert - 500 ');
    console.error('concert 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'concert 목록 검색 중 오류가 발생했습니다.' });
  }
}

/** 공연 상세정포 페이지의 스쿼드 목록
 * get : /search/datail/concert/squad
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetailConcertSquad = async ( req : Request, res : Response )=>{
  try {
    const concert_num = parseInt(req.query.concert_num as string);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
    
    if (isNaN(concert_num) || concert_num <= 0) {
      logger.error(' getDetailConcertSquad - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 공연 번호를 입력해주세요' });
    }
    
    if (isNaN(page) || page < 1 || !pageSize) {
      logger.error(' getDetailConcertSquad - 400 ');
      return res.status(400).json({ msg: '유효한 페이지 번호를 입력해주세요' });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    const { count, rows } = await db.SquadInfo.findAndCountAll({
      where: { concert_num },
      include: [{
        model: db.User,
        attributes: ['user_id', 'activate'],
      }],
      attributes: ['squad_num', 'concert_num', 'opener_num', 'show_time', 'member_num'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error(' getDetailConcertSquad - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, 'squads');

    logger.info(' getDetailConcertSquad - 200 ');
    return res.status(200).json({ msg: 'squad 목록을 성공적으로 불러왔습니다.', data: result });
  
  }catch (err) {
    logger.error(' getDetailConcertSquad - 500 ');
    console.error('squad 목록 검색 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'squad 목록 검색 중 오류가 발생했습니다.' });
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
    const artist_num = parseInt(req.query.artist_num as string);

    if (isNaN(artist_num) || artist_num <= 0) {
      logger.error(' getDetailArtist - 400 ');
      return res.status(400).json({ msg: '유효한 아티스트 번호를 입력해주세요' });
    }
    
    if (!Number.isInteger(artist_num)) {
      logger.error(' getDetailArtist - 400 ');
      return res.status(400).json({ msg: '아티스트 번호는 정수여야 합니다' });
    }
    const result = await db.Artists.findOne({
      where:{ artist_num },
    });

    logger.info(' getDetailArtist - 201 ');
    res.status(201).json({ msg : '데이터를 성공적으로 불러왔습니다.', data: result});
    
    // 응답 이후 조회수 증가
    const newCount = (result?.profile_click ?? 0) + 1;

    const updateCountObj : updateCountA = {
      profile_click : newCount
    }

    return await db.Artists.update( updateCountObj,{
      where:{ artist_num },
    });

  }catch (err) {
    logger.error(' getDetailArtist -500 ');
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
export const getDetailArtistReview = async (req: Request, res: Response) => {
  try {
    const artist_num = parseInt(req.query.artist_num as string);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
    
    if (isNaN(artist_num) || artist_num <= 0) {
      logger.error(' getDetailArtistReview - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 아티스트 번호를 입력해주세요' });
    }
    
    if (isNaN(page) || page < 1 || ! pageSize ) {
      logger.error(' getDetailArtistReview - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 페이지 번호를 입력해주세요' });
    }
    
    if (!Number.isInteger(artist_num)) {
      logger.error(' getDetailArtistReview - 400 ', req.query);
      return res.status(400).json({ msg: '아티스트 번호는 정수여야 합니다' });
    }

    const totalCount = await db.ConcertReview.count({
      where: { activate: true },
      include: [{
        model: db.ConcertInfo,
        where: { artist_num },
        attributes: []
      }],
    });

    const offset = pagination.offsetPagination(page, pageSize);

    const reviews = await db.ConcertReview.findAll({
      where: { activate: true },
      include: [{
        model: db.ConcertInfo,
        where: { artist_num },
        attributes: ['concert_title']
      }, {
        model: db.User,
        attributes: ['user_id', 'activate']
      }],
      attributes: ['creview_num', 'user_num', 'concert_num', 'creview_content', 'created_at'],
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      logger.error(' getDetailArtistReview - 404 ');
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지입니다.' });
    }

    const result = pagination.responsePagination(reviews, totalCount, page, pageSize, 'reviews');

    logger.info(' getDetailArtistReview - 200 ');
    return res.status(200).json({ msg: '리뷰 목록을 성공적으로 불러왔습니다.', data: result });
    
  } catch (err) {
    logger.error(' getDetailArtistReview - 500 ');
    console.error('아티스트 공연 리뷰 목록 검색 중 오류 발생:', err);
    return res.status(500).json({ msg: '아티스트 공연 리뷰 목록 검색 중 오류가 발생했습니다.' });
  }
};

/** 커뮤니티 게시판 검색
 * get : /search/community/list?category=&page=&search= 도달점
 * @param req 
 * @param res 
 */
export const getSearchCommunityList= async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.limit as string) || 6;
    const search = req.query.search as string;
    


    if (isNaN(page) || page < 1) {
      logger.error(' getSearchCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 페이지 번호를 입력해주세요' });
    }
    
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      logger.error(' getSearchCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 페이지 크기를 입력해주세요 (1-100)' });
    }
    
    if (!search || typeof search !== 'string' || search.trim() === '') {
      logger.error(' getSearchCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 검색어를 입력해주세요' });
    }
    
    // SQL 인젝션 방지를 위한 검색어 sanitize
    const vSearch = search.replace(/[%_\\]/g, '\\$&');
    
    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Community.findAndCountAll({
      where: { 
        activate: true,
        article_title: {
          [Op.like]: `%${vSearch}%`
        }  
      },
      include: [{
        model: db.User,
        attributes: ['user_id', 'activate'],
      }],
      attributes: ['article_num', 'article_title', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if(page>totalPages){
      logger.error(' getSearchCommunityList - 404 ');
      return res.status(404).json({msg : '게시글이 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    logger.info(' getSearchCommunityList - 200 ');
    return res.status(200).json({msg : '게시글 목록을 성공적으로 불러왔습니다.', data : result });
  
  } catch (err) {
    logger.error(' getSearchCommunityList - 500 ');
    console.error('Community 게시글 목록 검색 중 오류 발생:', err);
    return res.status(500).json({ msg: 'Community 게시글 목록 검색 중 오류가 발생했습니다.' });
  }
};

export const getCategoryCommunityList = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.limit as string) || 6;
    
    if (isNaN(page) || page < 1) {
      logger.error(' getCategoryCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 페이지 번호를 입력해주세요' });
    }
    
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      logger.error(' getCategoryCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 페이지 크기를 입력해주세요 (1-100)' });
    }
    
    if (!category || typeof category !== 'string' || category.trim() === '') {
      logger.error(' getCategoryCommunityList - 400 ', req.query);
      return res.status(400).json({ msg: '유효한 카테고리를 입력해주세요' });
    }
    
    const offset = pagination.offsetPagination(page, pageSize);
    const vCategory = category.replace(/[%_\\]/g, '\\$&');

    const { count, rows } = await db.Community.findAndCountAll({
      where: { 
        activate: true,
        category: {
          [Op.like]: `%${vCategory}%`
        } 
      },
      include: [{
        model: db.User,
        attributes: ['user_id', 'activate'],
      }],
      attributes: ['article_num', 'article_title', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if(page>totalPages){
      logger.error(' getCategoryCommunityList - 404 ');
      return res.status(404).json({msg : '게시글이 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    logger.info(' getCategoryCommunityList - 200 ');
    return res.status(200).json({msg : '게시글 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    logger.error(' getCategoryCommunityList - 500 ');
    console.error('Community 게시글 목록 검색 중 오류 발생:', err);
    return res.status(500).json({ msg: 'Community 게시글 목록 검색 중 오류가 발생했습니다.' });
  }
};


/** 메인페이지 진입시 보내는 요청
 *  
 * @param req 
 * @param res 
 */
export const getSearchMain = async (req: Request, res: Response) => {
  try {
    const artistResult = await db.Artists.findAll({
      order: [['profile_click', 'DESC']],
      limit: 10
    });
    
    const currentDate = new Date();
    
    const squadResult = await db.SquadInfo.findAll({
      where: {
        show_time: {
          [Op.gt]: currentDate
        }
      },
      order: db.sequelize.random(),
      limit: 10
    });

    logger.info(' getSearchMain - 200 ');
    return res.status(200).json({ msg: 'Sound_Squad 에 어서오세요!', artistResult, squadResult, currentDate });
  
  } catch (err) {
    logger.info(' getSearchMain - 500 ');
    console.error('목록을 불러오는 중 오류 발생:', err);
    return res.status(500).json({ msg: '목록을 불러오는 중 오류가 발생했습니다.' });
  }
};