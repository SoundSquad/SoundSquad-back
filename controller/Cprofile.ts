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

export const getProfileData = async (req: Request, res: Response) => {
  try {
    const user_num = parseInt(req.body.user_num as string);

    if (isNaN(user_num) || user_num <= 0) {
      logger.error(' getProfileData - 400 ', req.body);
      return res.status(400).json({ msg: '유효한 아티스트 번호를 입력해주세요' });
    }

    const user = await db.User.findOne({
      where:{ user_num, activate : true }
    });

    if(!user){
      logger.error(' getProfileData - 400 ');
      return res.status(404).json({ msg : '검색 결과가 없습니다.' });
    }

    logger.info(' getProfileData - 201 ');
    return res.status(201).json({ msg : '조회에 성공하였습니다.', data : user })

  } catch (err) {
    logger.error(' getProfileData - 500 ');
    console.error('Profile 의 유저 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Profile 의 유저 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};