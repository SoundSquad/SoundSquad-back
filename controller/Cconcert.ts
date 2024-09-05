import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
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

/** 공연에 대해서 리뷰를 작성할 수 있게 하는 요청
 * post : /concert/review 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const postConcertReview = async (req: Request, res: Response) => {
  try {
    const {user_num, concert_num, creview_content } = req.body;
    
    if(!user_num || !concert_num || !creview_content ){
      logger.error(' postConcertReview - 400 '+ req.body );
      return res.status(400).json({ 
        msg : '필수 정보가 누락되었습니다.',
        flag: false 
      });
    }
    
    const user = await db.User.findOne({
      where:{ user_num, activate : true }
    });
    const concert = await db.ConcertInfo.findByPk(concert_num);

    if (!user || !concert) {
      logger.error(' postConcertReview - 404 ');
      res.status(404).json({ 
        msg: '존재하지 않는 대상에 대한 접근입니다.',
        flag: false
      });
      return;
    }

    const result = await db.ConcertReview.create({
      user_num,
      concert_num,
      creview_content,
      activate: true
    });

    logger.info(' postConcertReview - 201 ');
    return res.status(201).json({ 
      msg : '리뷰를 성공적으로 작성했습니다.', 
      data : result,
      flag: true 
    });
  } catch (err) {
    logger.error(' postConcertReview - 500 ');    
    console.error('Concert 리뷰 작성중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: 'Concert 리뷰 작성중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

