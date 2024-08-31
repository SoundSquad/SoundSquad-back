import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import { exSquadAttributes } from '../modules/MsquadInfo';

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
  try {
    const { concert_num, user_num } = req.body;
    let status : number = 0;
    
    if (!user_num || !concert_num ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const checkConcert = await db.ConcertInfo.findOne({
      where:{concert_num},
    });
    
    if (!checkConcert) {
      return res.status(404).json({ msg: '공연 정보를 찾을 수 없습니다.' });  
    };

    const checkSquad = await db.SquadInfo.findOne({
      where : {opener_num : user_num}
    });

    if (checkSquad) {
      return res.status(403).json({ msg: '이미 생성된 스쿼드가 있습니다.' });  
    };

    const result = await db.SquadInfo.create({
      concert_num,
      opener_num : user_num,
      member_num : 0,
    });
    
    const tempData = await db.User.findOne({
      where:{ user_num : user_num },
    })

    if(!tempData?.introduce && !tempData?.mbti && !tempData?.prefer_genre ){
      status = 1;
    }

    return res.status(201).json({ msg: '작업이 성공적으로 진행되었습니다.', status, desc :'status 가 1 : 자기소개, mbti, prefer_genre 셋다 등록하지 않은 상태 , 0: 셋중 하나라도 등록한 상태' });
  } catch (err) {
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
  try {
    const { squad_num, user_num } = req.body;
    
    if (!user_num || !squad_num ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    const tempData = await db.SquadInfo.findOne({
      where:{squad_num : squad_num},
      attributes:['opener_num'],
    })
    
    if(user_num !== tempData?.opener_num){
      return res.status(403).json({msg : '권한이 없는 요청입니다.'});
    }    
    const updateSquad : exSquadAttributes ={
      member_num : 0,
    }
    await db.SquadInfo.update(updateSquad,{
      where:{ squad_num, opener_num : user_num }
    });
    
    return res.status(201).json({msg: '작업이 성공적으로 진행되었습니다.' });

  } catch (err) {
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
export const deleteOpenSquad = async (req: Request, res: Response) => {
  try {
    const { squad_num, user_num } = req.body;
    
    if (!user_num || !squad_num ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    const tempData = await db.SquadInfo.findOne({
      where:{squad_num : squad_num, opener_num : user_num },
      attributes:['opener_num'],
    })
    
    if(user_num !== tempData?.opener_num){
      return res.status(403).json({msg : '권한이 없는 요청입니다.'});
    }

    await db.SquadInfo.destroy({
      where:{ squad_num, opener_num : user_num }
    });
    
    return res.status(201).json({msg: '작업이 성공적으로 진행되었습니다.' });

  } catch (err) {
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
  try {
    const { squad_num, user_num } = req.body;
    if (!user_num || !squad_num ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const checkEmpty = await db.SquadInfo.findOne({
      where:{ squad_num},
      attributes:['squad_num'],
    });
    if( checkEmpty?.member_num ){
      return res.status(403).json({ msg : '이미 가득 찬 스쿼드입니다.' });
    }
    const checkDouble = await db.SquadInfo.findOne({
      where:{ member_num : user_num},
      attributes:['squad_num'],
    });
    if( checkDouble?.member_num ){
      return res.status(403).json({ msg : '이미 가입한 스쿼드가 있습니다.' });
    }

    const updateSquad : exSquadAttributes ={
      member_num : user_num,
    }

    await db.SquadInfo.update( updateSquad,{
      where : { squad_num }
    });

    return res.status(201).json({msg : 'squad 에 참여하는 데 성공했습니다.' });
  } catch (err) {
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
  try {
    const { squad_num, user_num } = req.body;
    if (!user_num || !squad_num ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const tempData = await db.SquadInfo.findOne({
      where:{ squad_num},
      attributes:['member_num'],
    });
    
    if( tempData?.member_num !== user_num ){
      return res.status(403).json({ msg : '권한이 없는 접근입니다.' });
    }

    const updateSquad : exSquadAttributes ={
      member_num : 0,
    }

    await db.SquadInfo.update( updateSquad,{
      where : { squad_num }
    });

    return res.status(201).json({ msg: 'Squad 스쿼드를 떠나는 데 성공했습니다.' });    
  } catch (err) {
    console.error('Squad 스쿼드를 떠나는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Squad 스쿼드를 떠나는 중 오류가 발생했습니다.' });
  }
};