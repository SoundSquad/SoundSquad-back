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

export const getAdminUser = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string);
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);
    
    if (!search || !page ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const { count, rows } = await db.User.findAndCountAll({
      where: {
        user_id: {
          [Op.like]: `%${search}%`
        }
      },
      offset,
      order: [['user_num', 'DESC']],
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if(page>totalPages){
      return res.status(404).json({msg : '결과가 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'users');

    return res.status(200).json({msg : ' 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    console.error('유저 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '유저 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};

export const getAdminCommunity = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string);
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);
    
    if (!search || !page ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const { count, rows } = await db.Community.findAndCountAll({
      where: {
        article_title: {
          [Op.like]: `%${search}%`
        }
      },
      offset,
      order: [['article_num', 'DESC']],
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if(page>totalPages){
      return res.status(404).json({msg : '게시글이 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    return res.status(200).json({msg : ' 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    console.error('게시글 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '게시글 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};

export const getAdminComment = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string);
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);
    
    if (!search || !page ) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const { count, rows } = await db.Comment.findAndCountAll({
      where: {
        comment_content: {
          [Op.like]: `%${search}%`
        }
      },
      offset,
      order: [['comment_num', 'DESC']],
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if(page>totalPages){
      return res.status(404).json({msg : '결과가 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'comments');

    return res.status(200).json({msg : ' 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    console.error('댓글 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '댓글 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const target = req.body.user_num;
    
    if(!target){
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    const checkUser = await db.User.findOne({where:{user_num: target, activate : true}});
    
    if(!checkUser){
      return res.status(400).json({ msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.' });  
    }

    const result = await db.User.update({ activate : false },{
      where:{ user_num : target }
    })

    return res.status(201).json({ msg : '대상을 비활성화 했습니다.', result });
    
  } catch (err) {
    console.error('유저 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '유저 정보를 비활성화 하는 중 오류가 발생했습니다.' });
  }
};

export const deleteAdminCommunity = async (req: Request, res: Response) => {
  try {
    const target = req.body.article_num;
    
    if(!target){
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    const checkCommunity = await db.Community.findOne({where:{article_num: target, activate : true}});
    
    if(!checkCommunity){
      return res.status(400).json({ msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.' });  
    }

    const result = await db.Community.update({ activate : false },{
      where:{ article_num : target }
    })

    return res.status(201).json({ msg : '대상을 비활성화 했습니다.', result });
      
  } catch (err) {
    console.error('게시글 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '게시글 정보를 비활성화 하는 중 오류가 발생했습니다.' });
  }
};

export const deleteAdminComment = async (req: Request, res: Response) => {
  try {
    const target = req.body.comment_num;
    
    if(!target){
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }
    
    const checkComment = await db.Comment.findOne({where:{comment_num: target, activate : true}});
    
    if(!checkComment){
      return res.status(400).json({ msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.' });  
    }

    const result = await db.Comment.update({ activate : false },{
      where:{ comment_num : target }
    })

    return res.status(201).json({ msg : '대상을 비활성화 했습니다.', result });
    
  } catch (err) {
    console.error('댓글 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: '댓글 정보를 비활성화 하는 중 오류가 발생했습니다.' });
  }
};

export const getAdminReport = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);

    if (!type || !page) {
      return res.status(400).json({ msg: '필수 정보가 누락되었습니다.' });
    }

    let count: number;
    let rows: any[];

    switch (type) {
      case 'community':
        ({ count, rows } = await db.Community.findAndCountAll({
          offset,
          order: [['article_num', 'DESC']],
          limit: pageSize,
        }));
        break;
      case 'comment':
        ({ count, rows } = await db.Comment.findAndCountAll({
          offset,
          order: [['comment_num', 'DESC']],
          limit: pageSize,
        }));
        break;
      case 'user':
        ({ count, rows } = await db.User.findAndCountAll({
          offset,
          order: [['user_num', 'DESC']],
          limit: pageSize,
        }));
        break;
      default:
        return res.status(400).json({ msg: '입력 형식에 오류가 있습니다.' });
    }

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      return res.status(404).json({ msg: '결과가 존재하지 않는 페이지 입니다.' });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, type);

    return res.status(200).json({ msg: '목록을 성공적으로 불러왔습니다.', data: result });

  } catch (err) {
    console.error('관리자 리포트를 가져오는 중 오류가 발생했습니다.', err);
    return res.status(500).json({ msg: '관리자 리포트를 가져오는 중 오류가 발생했습니다.' });
  }
};