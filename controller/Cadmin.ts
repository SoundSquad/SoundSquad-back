import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';
import logger from '../config/loggerConfig';
import { UpdatedPasswordFields } from '../modules/Muser';
import bcrypt from 'bcrypt';

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
      logger.error('getAdminUser - 400 ', req.query);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false
      });
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
      logger.error('getAdminUser - 404 ',totalPages, page );
      return res.status(404).json({
        msg : '결과가 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'users');

    logger.info('getAdminUser - 200 ');
    return res.status(200).json({
      msg : ' 목록을 성공적으로 불러왔습니다.',
      data : result ,
      flag : false
    });

  } catch (err) {
    console.error('유저 정보를 불러오는 중 오류 발생했습니다.', err);
    logger.error('getAdminUser - 500 ');
    return res.status(500).json({ 
      msg: '유저 정보를 불러오는 중 오류가 발생했습니다.',
      flag: false
    });
  }
};

export const getAdminCommunity = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string);
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);
    
    if (!search || !page ) {
      logger.error('getAdminCommunity - 400 ', req.query);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false 
      });
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
      logger.error('getAdminCommunity - 404 ');
      return res.status(404).json({
        msg : '게시글이 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    logger.info('getAdminCommunity - 200 ');
    return res.status(200).json({
      msg : ' 목록을 성공적으로 불러왔습니다.',
      data : result,
      flag: false
    });

  } catch (err) {
    logger.error('getAdminCommunity - 500 ');
    console.error('게시글 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '게시글 정보를 불러오는 중 오류가 발생했습니다.',
      flag: false
    });
  }
};

export const getAdminComment = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string);
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);
    
    if (!search || !page ) {
      logger.error('getAdminComment - 400 ', req.query);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false 
      });
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
      logger.error('getAdminComment - 404 ');
      return res.status(404).json({
        msg : '결과가 존재하지 않는 페이지 입니다.',
        flag: false
      });
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'comments');

    logger.info('getAdminComment - 200 ');
    return res.status(200).json({
      msg : ' 목록을 성공적으로 불러왔습니다.',
      flag: false,
      data : result 
    });

  } catch (err) {
    logger.error('getAdminComment - 500 ');
    console.error('댓글 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '댓글 정보를 불러오는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const target = req.body.target_num;
    
    if(!target){
      logger.error('deleteAdminUser - 400 ', req.body);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false
      });
    }

    if(target === parseInt(process.env.ADMIN_ID as string)){
      logger.error('deleteAdminUser - 403 ', req.body);
      return res.status(403).json({ 
        msg: '삭제할 수 없는 대상입니다.',
        flag: false 
      });
    }

    const checkUser = await db.User.findOne({where:{user_num: target, activate : true}});
    
    if(!checkUser){
      logger.error('deleteAdminUser - 404 ');
      return res.status(404).json({ 
        msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.',
        flag: false 
      });  
    }

    await db.User.update({ activate : false },{
      where:{ user_num : target }
    })

    logger.info('deleteAdminUser - 200 ');
    return res.status(200).json({ 
      msg : '대상을 비활성화 했습니다.',
      flag: false 
    });
    
  } catch (err) {
    logger.error('deleteAdminUser - 500 ');
    console.error('유저 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '유저 정보를 비활성화 하는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

export const deleteAdminCommunity = async (req: Request, res: Response) => {
  try {
    const target = req.body.target_num;
    
    if(!target){
      logger.error('deleteAdminCommunity - 400', req.body);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false 
      });
    }
    
    const checkCommunity = await db.Community.findOne({where:{article_num: target, activate : true}});
    
    if(!checkCommunity){
      logger.error('deleteAdminCommunity - 404 ');
      return res.status(404).json({ 
        msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.',
        flag: false 
      });  
    }

    await db.Community.update({ activate : false },{
      where:{ article_num : target }
    })

    logger.info('deleteAdminCommunity - 200 ');
    return res.status(200).json({ 
      msg : '대상을 비활성화 했습니다.',
      flag: false 
    });
      
  } catch (err) {
    logger.error('deleteAdminCommunity - 500 ');
    console.error('게시글 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '게시글 정보를 비활성화 하는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

export const deleteAdminComment = async (req: Request, res: Response) => {
  try {
    const target = req.body.target_num;
    
    if(!target){
      logger.error('deleteAdminComment - 400 ', req.body);
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false 
      });
    }
    
    const checkComment = await db.Comment.findOne({where:{comment_num: target, activate : true}});
    
    if(!checkComment){
      logger.error('deleteAdminComment - 404 ');
      return res.status(404).json({ 
        msg: '대상이 이미 비활성화 되었거나 존재하지 않는 대상입니다.',
        flag: false 
      });  
    }

    const result = await db.Comment.update({ activate : false },{
      where:{ comment_num : target }
    })

    logger.info('deleteAdminComment - 200 ');
    return res.status(200).json({ 
      msg : '대상을 비활성화 했습니다.',
      flag: false 
    });
    
  } catch (err) {
    logger.error('deleteAdminComment - 500 ');
    console.error('댓글 정보를 비활성화 하는 중 오류 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '댓글 정보를 비활성화 하는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
};

export const getAdminReport = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const page = parseInt(req.query.page as string);
    const pageSize = 6;
    const offset = pagination.offsetPagination(page, pageSize);

    if (!type || !page) {
      logger.error('getAdminReport - 400 ');
      return res.status(400).json({ 
        msg: '필수 정보가 누락되었습니다.',
        flag: false 
      });
    }

    let count: number;
    let rows: any[];

    switch (type) {
      case 'community':
        ({ count, rows } = await db.CommunityReport.findAndCountAll({
          offset,
          order: [['created_at', 'DESC']],
          limit: pageSize,
        }));
        break;
      case 'comment':
        ({ count, rows } = await db.CommentReport.findAndCountAll({
          offset,
          order: [['created_at', 'DESC']],
          limit: pageSize,
        }));
        break;
      case 'user':
        ({ count, rows } = await db.ReportUser.findAndCountAll({
          offset,
          order: [['created_at', 'DESC']],
          limit: pageSize,
        }));
        break;
      default:
        logger.error('getAdminReport - 400 ');
        return res.status(400).json({ 
          msg: '입력 형식에 오류가 있습니다.',
          flag: false 
        });
    }

    const totalPages = Math.ceil(count / pageSize);
    if (page > totalPages) {
      logger.error('getAdminReport - 404 ');
      return res.status(404).json({ 
        msg: '결과가 존재하지 않는 페이지 입니다.',
        flag: false 
      });
    }

    const result = pagination.responsePagination(rows, count, page, pageSize, type);

    logger.info('getAdminReport - 200 ');
    return res.status(200).json({ 
      msg: '목록을 성공적으로 불러왔습니다.', 
      data: result,
      flag: false 
    });

  } catch (err) {
    logger.error('getAdminReport - 500 ');
    console.error('관리자 리포트를 가져오는 중 오류가 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '관리자 리포트를 가져오는 중 오류가 발생했습니다.',
      flag: false
    });
  }
};

export const resetPassword = async( req : Request, res : Response ) => {
  try{
    let updatedFields: UpdatedPasswordFields = {};

    const hashedPw = bcrypt.hashSync('1234', parseInt(process.env.SALT_ROUNDS as string ));
    updatedFields.user_pw = hashedPw;

    // Handle profile image
    if (req.file) {
        updatedFields.user_pw = hashedPw;
    }
    // Handle password change
    
    await db.User.update(updatedFields, {
        where: { user_num : parseInt(process.env.ADMIN_ID as string ) },
    });

  }catch(err){
    logger.error('resetPassword - 500 ');
    console.error('관리자 권한을 실행하는 중 오류가 발생했습니다.', err);
    return res.status(500).json({ 
      msg: '관리자 권한을 실행하는 중 오류가 발생했습니다.',
      flag: false 
    });
  }
}