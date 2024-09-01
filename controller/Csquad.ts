import { Request, Response } from 'express';
import db from '../models';
import { Transaction } from 'sequelize';
import dotenv from 'dotenv';
import { exSquadAttributes, avgRatingUpdateObj } from '../modules/MsquadInfo';
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

/** 스쿼드를 여는 요청에 대한 함수
 * post : /squad 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const postOpenSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const { concert_num, user_num } = req.body;
    let status : number = 0;

    if (!user_num || !concert_num ) {
      logger.error(' postOpenSquad - 400 ', req.body);
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    transaction = await db.sequelize.transaction();

    const checkConcert = await db.ConcertInfo.findOne({
      where:{concert_num},
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if (!checkConcert) {
      logger.error(' postOpenSquad - 404 ');
      return res.status(404).json({ msg: '공연 정보를 찾을 수 없습니다.' });  
    };

    const checkSquad = await db.SquadInfo.findOne({
      where : {opener_num : user_num},
      lock: Transaction.LOCK.UPDATE,
      transaction
    });

    if (checkSquad) {
      logger.error(' postOpenSquad - 400, 이미 생성된 스쿼드가 있습니다.' );
      return res.status(400).json({ msg: '이미 생성된 스쿼드가 있습니다.' });  
    };

    await db.SquadInfo.create({
      concert_num,
      opener_num : user_num,
      member_num : 0,
      show_time: checkConcert.start_date
    },{transaction});
    
    const tempData = await db.User.findOne({
      where:{ user_num : user_num, activate : true },
      lock: Transaction.LOCK.UPDATE,
      transaction
    })

    if(!tempData?.introduce && !tempData?.mbti && !tempData?.prefer_genre ){
      status = 1;
    }
    
    await transaction.commit();

    logger.info(' postOpenSquad - 201');
    return res.status(201).json({ msg: '작업이 성공적으로 진행되었습니다.', status, desc :'status 가 1 : 자기소개, mbti, prefer_genre 셋다 등록하지 않은 상태 , 0: 셋중 하나라도 등록한 상태' });
  } catch (err) {
    logger.error(' postOpenSquad - 500' );
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드를 여는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 여는 중 오류가 발생했습니다.' });
  }
};
/** 멤버를 추방 하려는 요청 대한 함수
 * patch : /squad 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const patchOpenSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  try {
    const { squad_num, user_num } = req.body;
    
    if (!user_num || !squad_num ) {
      logger.error(' patchOpenSquad - 400', req.body );
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    transaction = await db.sequelize.transaction();
    
    const tempData = await db.SquadInfo.findOne({
      where:{squad_num : squad_num},
      attributes:['opener_num'],
      lock: Transaction.LOCK.UPDATE,
      transaction
    })
    
    if(user_num !== tempData?.opener_num){
      logger.error(' patchOpenSquad - 403' );
      return res.status(403).json({msg : '권한이 없는 요청입니다.'});
    }    

    const squadInfo = await db.SquadInfo.findOne({
      where:{ squad_num, opener_num : user_num },
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if (squadInfo) {
      squadInfo.member_num = 0;
      await squadInfo.save({ transaction });
    }

    await transaction.commit();
    
    logger.info(' patchOpenSquad - 201' );
    return res.status(201).json({msg: '작업이 성공적으로 진행되었습니다.' });

  } catch (err) {
    logger.error(' patchOpenSquad - 500' );
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드멤버를 추방하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 추방하는 중 오류가 발생했습니다.' });
  }
};

/** 스쿼드를 닫는 요청에 대한 함수
 * delete : /squad 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteOpenSquad = async (req: Request, res: Response) => {let transaction: Transaction | null = null;
  
  try {
    const { squad_num, user_num } = req.body;
    
    if (!user_num || !squad_num ) {
      logger.error(' deleteOpenSquad - 400', req.body );
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    transaction = await db.sequelize.transaction();
    
    const tempData = await db.SquadInfo.findOne({
      where:{squad_num : squad_num, opener_num : user_num },
      attributes:['opener_num'],
      lock: Transaction.LOCK.UPDATE,
      transaction
    })
    
    if(user_num !== tempData?.opener_num){
      logger.error(' deleteOpenSquad - 403' );
      return res.status(403).json({msg : '권한이 없는 요청입니다.'});
    }

    await db.SquadInfo.destroy({
      where:{ squad_num, opener_num : user_num },
      transaction
    });

    await transaction.commit();
    
    logger.info(' deleteOpenSquad - 201' );
    return res.status(201).json({msg: '작업이 성공적으로 진행되었습니다.' });

  } catch (err) {
    logger.error(' deleteOpenSquad - 500' );
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드를 닫는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 닫는 중 오류가 발생했습니다.' });
  }
};

/** 스쿼드에 참여하려는 요청
 * patch : /squad/member 
 * 
 * @param req 
 * @param res 
 */
export const postJoinSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  
  try {
    const { squad_num, user_num } = req.body;
    if (!user_num || !squad_num ) {
      logger.error(' postJoinSquad - 400', req.body );
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    transaction = await db.sequelize.transaction();

    const checkEmpty = await db.SquadInfo.findOne({
      where:{ squad_num},
      attributes:['squad_num'],
      lock: Transaction.LOCK.UPDATE,
      transaction
    });

    if( checkEmpty?.member_num ){
      logger.error(' postJoinSquad - 403');
      return res.status(403).json({ msg : '이미 가득 찬 스쿼드입니다.' });
    }

    const checkDouble = await db.SquadInfo.findOne({
      where:{ member_num : user_num},
      attributes:['squad_num'],
      lock: Transaction.LOCK.UPDATE,
      transaction
    });

    if( checkDouble?.member_num ){
      logger.error(' postJoinSquad - 403');
      return res.status(403).json({ msg : '이미 가입한 스쿼드가 있습니다.' });
    }

    const squadInfo = await db.SquadInfo.findOne({
      where: { squad_num },
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if (squadInfo) {
      squadInfo.member_num = user_num;
      await squadInfo.save({ transaction });
    }

    await transaction.commit();

    logger.info(' postJoinSquad - 201');
    return res.status(201).json({msg : 'squad 에 참여하는 데 성공했습니다.' });

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드에 참여하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드에 참여하는 중 오류가 발생했습니다.' });
  }
};

/** 스쿼드에서 떠나려는 요청
 * delete : /squad/member
 * 
 * @param req 
 * @param res 
 */
export const deleteLeaveSquad = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;

  try {
    const { squad_num, user_num } = req.body;
    if (!user_num || !squad_num ) {
      logger.error(' deleteLeaveSquad - 400', req.body);
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    transaction = await db.sequelize.transaction();
    
    const tempData = await db.SquadInfo.findOne({
      where:{ squad_num},
      attributes:['member_num'],
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if( tempData?.member_num !== user_num ){
      logger.error(' deleteLeaveSquad - 403');
      return res.status(403).json({ msg : '권한이 없는 접근입니다.' });
    }

    const squadInfo = await db.SquadInfo.findOne({
      where: { squad_num },
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if (squadInfo) {
      squadInfo.member_num = 0,
      await squadInfo.save({ transaction });
    }

    await transaction.commit();

    logger.info(' deleteLeaveSquad - 201');
    return res.status(201).json({ msg: 'Squad 스쿼드를 떠나는 데 성공했습니다.' }); 
    
  } catch (err) {
    logger.error(' deleteLeaveSquad - 500');
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드를 떠나는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 떠나는 중 오류가 발생했습니다.' });
  }
};

/** 스쿼드를 리뷰하는 요청
 * post : /squad/review 의 도달점
 * 
 * @param req 
 * @param res 
 */
export const postSquadReview = async (req: Request, res: Response) => {
  let transaction: Transaction | null = null;
  
  try {
    const { squad_num, user_num, rating } = req.body;

    if (!squad_num || !user_num || !rating) {
      logger.error(' postSquadReview - 400', req.body );
      return res.status(400).json({ msg: '필수 정보가 입력되지 않았습니다.' });
    }

    transaction = await db.sequelize.transaction();

    const checkSquad = await db.SquadInfo.findOne({
      where: { squad_num },
      lock: Transaction.LOCK.UPDATE,
      transaction
    });

    if (!checkSquad || (checkSquad.opener_num !== user_num && checkSquad.member_num !== user_num)) {
      await transaction.rollback();
      logger.error(' postSquadReview - 403' );
      return res.status(403).json({ msg: '권한이 없는 접근입니다.' });  
    }

    const isOpener = checkSquad.opener_num === user_num;
    const targetUser = isOpener ? checkSquad.member_num : checkSquad.opener_num;

    if (!targetUser) {
      await transaction.rollback();
      logger.error(' postSquadReview - 404' );
      return res.status(404).json({ msg: '참여한 스쿼드를 찾을 수 없습니다.' });
    }

    await db.UserReview.create({
      writer_num: user_num,
      squad_num,
      rating,
      reviewed_user: targetUser,
      activate: true,
      concert_num: checkSquad.concert_num,
    }, { transaction });

    const reviews = await db.UserReview.findAll({
      where: { reviewed_user: targetUser },
      attributes: ['rating'],
      lock: Transaction.LOCK.SHARE,
      transaction
    });

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const user = await db.User.findOne({
      where: { user_num: targetUser, activate : true },
      lock: Transaction.LOCK.UPDATE,
      transaction
    });
    
    if (user) {
      user.user_rating = avgRating;
      await user.save({ transaction });
    }

    await transaction.commit();
    
    logger.info(' postSquadReview - 201' );
    return res.status(201).json({ msg: '작업이 성공적으로 종료되었습니다.' });
  } catch (err) {
    logger.error(' postSquadReview - 500' );
    if (transaction) await transaction.rollback();
    console.error('Squad 스쿼드를 평가하던 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 평가하던 중 오류가 발생했습니다.' });
  }
};