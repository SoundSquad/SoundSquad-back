import { Request, Response } from 'express';
import db from '../models';
import { Op, Transaction } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';
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

/** 마이페이지에서 유저 정보를 요청하는 함수
 * get : /mypage/user?user_num= 의 도달점
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypageUserInfo = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    
    console.log(targetUserNum);
    console.log(nowUser)
    
    

    if(!targetUserNum){
      logger.error(' getMypageUserInfo - 400 ', req.query, nowUser );
      return res.status(400).json({ 
        msg : '필수 정보가 누락되었습니다. ',
        flag: false 
      });
    }

    if(targetUserNum !== nowUser){
      logger.error(' getMypageUserInfo - 403 ');
      return res.status(403).json({ 
        msg : '접근 권한이 없습니다.',
        flag: false 
      });
    }

    const result = await db.User.findOne({ 
      where : { user_num : targetUserNum, activate : true},
      attributes:['user_num','user_id','user_gender','user_bd','introduce','profile_img','prefer_genre','mbti','user_rating'], 
    });

    if(!result){
      logger.error(' getMypageUserInfo - 404 ');
      return res.status(404).json({ 
        msg : '정보를 조회하던 중 오류가 발생했습니다. ',
        flag: false
       });
    }

    logger.info(' getMypageUserInfo - 200 ');
    return res.status(200).json({ 
      msg : '정보를 성공적으로 조회했습니다.',
      data : result,
      flag: false });
  } catch (err) {
    logger.error(' getMypageUserInfo - 500 ');
    console.error('Mypage 유저 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Mypage 유저 정보를 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

/** 마이페이지에서 사용자가 작성한 게시글 목록을 조회
 * get : /mypage/community?user_num=&page= 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypagePost = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;

    if(!targetUserNum || !page || !pageSize ){
      logger.error(' getMypagePost - 400 ', req.query);
      return res.status(400).json({ 
        msg : '누락된 필수 항목이 있습니다.',
        flag: false 
      });
    }
    
    if(targetUserNum !== nowUser){
      logger.error(' getMypagePost - 403 ');
      return res.status(403).json({ 
        msg : '접근 권한이 없습니다.',
        flag: false 
      });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Community.findAndCountAll({
      where: { user_num: targetUserNum , activate: true },
      include: [{
        model: db.User,
        attributes: ['user_id', 'activate'],
      }],
      attributes: ['article_num', 'article_title', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if( page > totalPages ){
      logger.error(' getMypagePost - 404 ');
      return res.status(404).json({
        msg : '게시글이 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    logger.info(' getMypagePost - 200 ');
    return res.status(200).json({
      msg : '게시글 목록을 성공적으로 불러왔습니다.', 
      data : result,
      flag: false 
    });

  } catch (err) {
    logger.error(' getMypagePost - 500 ');
    console.error('Mypage 게시글 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Mypage 게시글 목록을  불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

/** 마이페이지에서 사용자가 작성한 댓글 목록을 조회하는 요청
 * get : /mypage/comment?user_num=&page=
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypageComment = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;

    if(!targetUserNum || !page || !pageSize ){
      logger.error(' getMypageComment - 400 ', req.query);
      return res.status(400).json({ 
        msg : '누락된 필수 항목이 있습니다.',
        flag: false 
      });
    }
    if(targetUserNum !== nowUser){
      logger.error(' getMypageComment - 403 ');
      return res.status(403).json({ 
        msg : '접근 권한이 없습니다.',
        flag: false
      });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Comment.findAndCountAll({
      where: { user_num: targetUserNum , activate: true },
      include: [{
        model: db.User,
        attributes: ['user_id', 'activate'],
      }],
      attributes: ['comment_num', 'comment_content', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if( page > totalPages ){
      logger.error(' getMypageComment - 404 ');
      return res.status(404).json({
        msg : '댓글이 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'comments');

    logger.info(' getMypageComment - 200 ');
    return res.status(200).json({
      msg : '댓글 목록을 성공적으로 불러왔습니다.', 
      data : result 
    });

  } catch (err) {
    logger.error(' getMypageComment - 500 ');
    console.error('Mypage 댓글 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Mypage 댓글 목록을 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

/** 마이페이지에서 작성한 공연 리뷰 목록을 조회하는 기능
 * get : mypage/review?user_num=&page=
 * 
 * @param req 
 * @param res 
 */
export const getMyPageReview = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    const page = parseInt(req.query.page as string) || undefined;
    const pageSize = parseInt(req.query.limit as string) || 6;

    if(!targetUserNum || !page || !pageSize ){
      logger.error(' getMypageReview - 400 ', req.query);
      return res.status(400).json({ 
        msg : '누락된 필수 항목이 있습니다.',
        flag: false
      });
    }
    if(targetUserNum !== nowUser){
      logger.error(' getMypageReview - 403 ');
      return res.status(403).json({ 
        msg : '접근 권한이 없습니다.',
        flag: false 
      });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.ConcertReview.findAndCountAll({
      where: { user_num: targetUserNum, activate: true },
      include: [
        {
          model: db.User,
          attributes: ['user_id', 'activate'],
        },
        {
          model: db.ConcertInfo,
          attributes: ['concert_title'],
        }
      ],
      attributes: ['creview_num', 'creview_content', 'user_num', 'concert_num', 'createdAt'],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / pageSize);
    if( page > totalPages ){
      logger.error(' getMypageReview - 404 ');
      return res.status(404).json({
        msg : '리뷰가 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination( rows, count, page, pageSize, 'reviews');
    
    logger.info(' getMypageReview - 200 ');
    return res.status(200).json({
      msg : '리뷰 목록을 성공적으로 불러왔습니다.', 
      data : result,
      flag: false 
    });

  } catch (err) {
    logger.error(' getMypageReview - 500 ');
    console.error('Mypage 리뷰 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Mypage 리뷰 목록을 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};


/** 마이페이지에서 개설한 스쿼드 정보를 보여주기
 * get : /mypage/opensquad
 * @param req 
 * @param res 
 */
export const getMypageOpenSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 6;
    const currentDate = new Date();

    if (isNaN(targetUserNum) || isNaN(page) || isNaN(pageSize) || targetUserNum <= 0 || page <= 0 || pageSize <= 0) {
      logger.error(' getMypageOpenSquad - 400 '+ req.query );
      return res.status(400).json({ 
        msg: '유효하지 않은 입력값입니다.',
        flag: false 
      });
    }

    if (targetUserNum !== nowUser) {
      logger.error(' getMypageOpenSquad - 403 ');
      return res.status(403).json({ 
        msg: '접근 권한이 없습니다.',
        flag: false 
      });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    
    transaction = await db.sequelize.transaction();

    const { rows, count } = await db.SquadInfo.findAndCountAll({
      where: { opener_num: targetUserNum },
      include: [
        { 
          model: db.ConcertInfo, 
          attributes: ['concert_title', 'start_date','concert_image']
        }
      ],
      attributes: ['squad_num', 'concert_num', 'opener_num', 'show_time', 'member_num', 'created_at'],
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']],  // 최신순으로 정렬
      lock: Transaction.LOCK.SHARE,
      transaction
    });

    const squadWithStatus = await Promise.all(rows.map(async (squad) => {
      const concertDate = new Date(squad.show_time);
      const isPast = concertDate < currentDate; 

      const review = await db.UserReview.findOne({
        where: { squad_num: squad.squad_num },
        transaction
      });

      return {
        ...squad.toJSON(),
        status: {
          isPast,
          hasReview: !!review
        }
      };
    }));

    const result = pagination.responsePagination(squadWithStatus, count, page, pageSize, 'squads');

    await transaction.commit();

    logger.info(' getMypageOpenSquad - 200 ');
    return res.status(200).json({ 
      msg: '목록을 성공적으로 불러왔습니다.', 
      data: result 
    });

  } catch (err) {
    logger.error(' getMypageOpenSquad - 500 ');
    if (transaction) await transaction.rollback();
    console.error('Mypage 개설 스쿼드 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Mypage 개설 스쿼드 목록을 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

/** 마이페이지에서 참여한 스쿼드 정보를 보여주기
 * get : /mypage/opensquad
 * @param req 
 * @param res 
 */
export const getMypageJoinSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user.user_num);
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.limit as string) || 6;
    const currentDate = new Date();

    if (isNaN(targetUserNum) || isNaN(page) || isNaN(pageSize) || targetUserNum <= 0 || page <= 0 || pageSize <= 0) {
      logger.error(' getMypageJoinSquad - 400 ', req.query);
      return res.status(400).json({ 
        msg: '유효하지 않은 입력값입니다.' 
      });
    }

    if (targetUserNum !== nowUser) {
      logger.error(' getMypageJoinSquad - 403 ');
      return res.status(403).json({ 
        msg: '접근 권한이 없습니다.' 
      });
    }

    const offset = pagination.offsetPagination(page, pageSize);
    
    transaction = await db.sequelize.transaction();

    const { rows, count } = await db.SquadInfo.findAndCountAll({
      where: { member_num: targetUserNum },
      include: [
        { 
          model: db.ConcertInfo, 
          attributes: ['concert_title', 'start_date']
        }
      ],
      attributes: ['squad_num', 'concert_num', 'opener_num', 'show_time', 'member_num', 'created_at'],
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']],  // 최신순으로 정렬
      lock: Transaction.LOCK.SHARE,
      transaction
    });

    const squadWithStatus = await Promise.all(rows.map(async (squad) => {
      const concertDate = new Date(squad.show_time);
      const isPast = concertDate < currentDate; 

      const review = await db.UserReview.findOne({
        where: { squad_num: squad.squad_num },
        transaction
      });

      return {
        ...squad.toJSON(),
        status: {
          isPast,
          hasReview: !!review
        }
      };
    }));

    const result = pagination.responsePagination(squadWithStatus, count, page, pageSize, 'squads');

    await transaction.commit();

    logger.info(' getMypageJoinSquad - 200 ');
    return res.status(200).json({ 
      msg: '목록을 성공적으로 불러왔습니다.', 
      data: result,
      flag: false 
    });

  } catch (err) {
    logger.error(' getMypageJoinSquad - 500 ');
    if (transaction) await transaction.rollback();
    console.error('Mypage 개설 스쿼드 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({
      msg: 'Mypage 개설 스쿼드 목록을 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};