import { Request, Response } from 'express';
import db from '../models';
import { Op, Transaction } from 'sequelize';
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

export const postReportUser = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;

  try {
    const writer = ( req.body.writer_num );
    const target = ( req.body.target_num );
    
    if( !writer || !target ){
      logger.error(' postRepostUser - 400 ');
      return res.status(400).json({ msg : ' 필수 정보가 누락되었습니다 . ' });
    }

    transaction = await db.sequelize.transaction();

    const checkStatus = await db.User.findOne({
      where:{user_num : target, activate : true },
      lock: Transaction.LOCK.UPDATE,
      transaction
    })
    
    if(!checkStatus){
      if (transaction) await transaction.rollback();
      logger.error(' postRepostUser - 404 ');
      return res.status(404).json({ msg : '대상을 찾을 수 없습니다.' });
    }

    await db.ReportUser.create({
      user_num :target,
      writer_num : writer,
    },{transaction});

    await transaction.commit();

    logger.info(' postRepostUser - 201 ');
    return res.status(201).json({ msg : '신고 내역을 기록했습니다.' });

  } catch (err) {
    logger.error(' postRepostUser - 500 ');
    if (transaction) await transaction.rollback();
    console.error('user 에 대한 신고 내역을 기록하는 중 오류가 발생했습니다.', err);
    return res.status(500).json({ msg: '신고 내역을 기록하는 중 오류가 발생했습니다.' });
  }
};

export const postReportCommunity = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const writer = ( req.body.writer_num );
    const target = ( req.body.target_num );

    if(!writer || !target){
      logger.error(' postReportCommunity - 400 ');
      return res.status(400).json({ msg : ' 필수 정보가 누락되었습니다. ' });
    }

    transaction = await db.sequelize.transaction();

    const checkStatus = await db.Community.findOne({
      where:{ article_num : target, activate : true },
      lock: Transaction.LOCK.UPDATE,
      transaction
    })
    
    if(!checkStatus){
      if (transaction) await transaction.rollback();
      logger.error(' postReportCommunity - 404 ');
      return res.status(404).json({ msg : '대상을 찾을 수 없습니다.' });
    }

    await db.CommunityReport.create({
      article_num :target,
      writer_num : writer,
    },{transaction});

    await transaction.commit();
    
    logger.info(' postReportCommunity - 400 ');
    return res.status(201).json({ msg : '신고 내용을 기록했습니다. '});
  
  } catch (err) {
    logger.error(' postReportCommunity - 500 ');
    if (transaction) await transaction.rollback();
    console.error('community 에 대한 신고 내역을 기록하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '신고 내역을 기록하는 중 오류가 발생했습니다.' });
  }
};

export const postReportComment = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const writer = ( req.body.writer_num );
    const target = ( req.body.target_num );

    if( !writer || !target ){
      logger.error(' postReportComment - 400 ');
      return res.status(400).json({ msg : '필수 정보가 누락되었습니다.' });
    }

    transaction = await db.sequelize.transaction();

    const checkStatus = await db.Comment.findOne({
      where:{ comment_num : target, activate : true },
      lock: Transaction.LOCK.UPDATE,
      transaction
    })
    
    if(!checkStatus){
      if (transaction) await transaction.rollback();
      logger.error(' postReportComment - 404 ');
      return res.status(404).json({ msg : '대상을 찾을 수 없습니다.' });
    }

    await db.CommentReport.create({
      comment_num :target,
      writer_num : writer,
    },{transaction});

    await transaction.commit();
    
    logger.info(' postReportComment - 201 ');
    return res.status(201).json({ msg : '신고 내용을 기록했습니다.' });

  } catch (err) {
    logger.error(' postReportComment - 500 ');
    if (transaction) await transaction.rollback();
    console.error('comment 에 대한 신고 내역을 기록하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '신고 내역을 기록하는 중 오류가 발생했습니다.' });
  }
};