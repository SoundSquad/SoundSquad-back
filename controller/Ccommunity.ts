import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';


dotenv.config();

export const testApi = async ( req : Request, res : Response ) => {
  try {
    console.log('req >>>> ', req );
    
  } catch (err) {
    console.error(err);
  }
};

// 커뮤니티 게시판 목록에 보여질 게시글에 대한 정보에 대해 페이징하고 요청한 페이지를 전달
export const getCommunityPosts = async ( req: Request, res: Response ) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.page_size as string) || 10;

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Community.findAndCountAll({
      where: { activate: true},
      include: [{
        model: db.User,
        through: { attributes: [] }
      }],
      attributes: ['article_num', 'article_title', 'user_num', 'created_at', 'user_name'],
      offset,
      limit: pageSize,
    });

    const paginatedResult = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    res.json({msg : '게시글 목록을 성공적으로 불러왔습니다.', data : paginatedResult });

  } catch (err) {
    console.error('Community 게시판 불러오는 중 오류 발생했습니다.', err);
    res.status(500).json({ msg : 'Community 게시판에 게시글을 불러오는 중 오류가 발생했습니다.' }); //'Internal server error'
  }
};


export const getCommunityPost = async (req: Request, res: Response) => {
  try {    
    const reqArticleNumStr = req.query.article_num as string | undefined;

    if (!reqArticleNumStr) {
      return res.status(400).json({ msg : '조회할 게시글의 식별번호를 입력해야 합니다.' });
    }

    const articleNum = parseInt( reqArticleNumStr, 10);

    const result = await db.Community.findOne({
      where: { activate: true, article_num: articleNum },
      include: [{
        model: db.Comment,
        where : { activate :true },
        attributes: ['comment_num', 'user_num', 'comment_content', 'created_at'],
        include: [{
          model: db.User,
          attributes: ['user_id', 'profile_img'],
        }],  
      }],
      attributes: ['article_num', 'user_num', 'category', 'article_title', 'article_content', 'created_at', 'updated_at'],
    });

    if (!result) {
      return res.status(404).json({ msg : '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      msg : '게시글을 성공적으로 불러왔습니다.',
      data: result
    });

  } catch (err) {
    console.error('Community 게시글을 불러오는 중 오류 발생했습니다.', err);
    res.status(500).json({ msg : 'Community 게시판에 게시글을 불러오는 중 오류가 발생했습니다.' });
  }
}


// 커뮤니티 게시판에 게시글을 작성하는 경우
export const postCommunityPost = async( req:Request, res:Response )=>{
  try{
    const { user_num, category, article_title, article_content } = req.body;
    
    if(!user_num){
      return res.status(403).json({msg : '게시글 작성 권한이 없습니다.'});
    }

    if (!user_num || !category || !article_title || !article_content) {
      return res.status(400).json({ msg: '필수 데이터 중 입력되지 않은 데이터가 있습니다.' });
    }

    await db.Community.create({
      user_num,
      category,
      article_title,
      article_content,
      activate : true,
    })

    res.status(200).json({msg : '게시글을 성공적으로 작성했습니다.'});
  }catch(err){
    console.error('Community 게시글 작성중 오류 발생',err);
    res.status(500).json({ msg: 'Community 게시판에 게시글을 작성하는 중 오류가 발생했습니다.' });
  }
};

// 커뮤니티 게시판에 작성된 게시글을 수정하는 경우

interface UpdateTargetCommunity { // 추후 분리 예정
  category: string;
  article_title: string;
  article_content: string;
}

export const patchCommunityPost = async (req: Request, res: Response) => {
  try {
    const { article_num, user_num, category, article_title, article_content } = req.body;
    
    if (!user_num || !article_num || !category || !article_title || !article_content) {
      return res.status(400).json({ msg: '필수 데이터 중 전송되지 않은 데이터가 있습니다.' });
    }
    
    const target = await db.Community.findOne({ where: { article_num, activate: true } });
    
    if (!target) {
      return res.status(404).json({ msg : '게시글이 이미 삭제되었거나 존재하지 않습니다.' });
    }
    
    if (target.user_num !== user_num) { //target.user_num : 수정 대상의 작성자, user_num : 현재 접속자
      return res.status(403).json({ msg : '게시글 수정 권한이 없습니다.' });
    }

    const updateTarget: UpdateTargetCommunity = {
      category,
      article_title,
      article_content
    };

    const result = await db.Community.update(updateTarget, {
      where: { article_num, activate: true }
    });

    if ( !result ) {
      return res.status(404).json({ msg : '수정할 게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ msg : '게시글이 성공적으로 수정되었습니다.' });

  } catch (err) {
    console.error('Community 게시글 수정 중 오류가 발생했습니다. :', err);
    res.status(500).json({ msg : 'Community 게시판에 게시글을 수정하는 중 오류가 발생했습니다.' });
  }
};


interface DeleteTarget { // 추후 분리 예정
  activate:boolean;
}

export const deleteCommunityPost = async( req : Request, res: Response )=>{
  try {
    const {user_num, article_num} = req.body;
    
    const target = await db.Community.findOne({ where: { article_num, activate: true } });
      
    if (!target) {
      return res.status(404).json({ msg : '게시글이 이미 삭제되었거나 존재하지 않습니다.' });
    }
    
    if (target.user_num !== user_num) {
      return res.status(403).json({ msg : '게시글 삭제 권한이 없습니다.' });
    }

    const deleteTarget: DeleteTarget = {
      activate : false,
    };

    const result = await db.Community.update( deleteTarget, {
      where: { article_num, activate: true }
    });

    if ( !result ) {
      return res.status(404).json({ msg : '삭제할 게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ msg : '게시글이 성공적으로 삭제되었습니다.' });

  } catch (err) {
    console.error('Community 게시글 삭제 중 오류가 발생했습니다. :', err);
    res.status(500).json({ msg : 'Community 게시판에 게시글을 삭제하는 중 오류가 발생했습니다.' });
  } 
}

export const postCommunityComment = async( req:Request, res: Response )=>{
  try{
    const { user_num, article_num, comment_content } = req.body;
    
    if(!user_num){
      return res.status(403).json({msg : '댓글 작성 권한이 없습니다.'});
    }

    if (!article_num || !comment_content ) {
      return res.status(400).json({ msg: '필수 데이터 중 입력되지 않은 데이터가 있습니다.' });
    }

    await db.Comment.create({
      user_num,
      article_num,
      comment_content,
      activate : true,
    });

    res.status(200).json({msg : '댓글을 성공적으로 작성했습니다.'});    
  }catch(err){
    console.error('Community 댓글 작성 중 오류가 발생했습니다. :', err);
    res.status(500).json({ msg : 'Community 댓글 작성 중 오류가 발생했습니다.' });
  }
}
interface UpdateTargetComment { // 추후 분리 예정
  comment_content : string;
}
export const patchCommunityComment = async( req:Request, res:Response )=>{
  try {
    const{ comment_num, comment_content }=req?.body;
    const user_num = parseInt(req.body?.user_num);

    console.log( user_num, comment_num, comment_content);
    
    if (!user_num || !comment_num || !comment_content ) {
      return res.status(400).json({ msg: '필수 데이터 중 전송되지 않은 데이터가 있습니다.' });
    }
    
    const target = await db.Comment.findOne({ where: { comment_num, activate: true } });
    
    if (!target) {
      return res.status(404).json({ msg : '게시글이 이미 삭제되었거나 존재하지 않습니다.' });
    }
    
    if (target.user_num !== user_num) { //target.user_num : 수정 대상의 작성자, user_num : 현재 접속자

      return res.status(403).json({ msg : '게시글 수정 권한이 없습니다.' });
    }

    const updateTarget: UpdateTargetComment = {
      comment_content: comment_content,
    };

    const result = await db.Comment.update(updateTarget, {
      where: { comment_num, activate: true }
    });

    if ( !result ) {
      return res.status(404).json({ msg : '수정할 게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ msg : '게시글이 성공적으로 수정되었습니다.' });


  } catch (err) {
    console.error('Community 댓글 수정 중 오류가 발생했습니다. :', err);
    res.status(500).json({ msg : 'Community 댓글 수정 중 오류가 발생했습니다.' });    
  }
}


export const deleteCommunityComment = async( req : Request, res: Response )=>{
  console.log('deleteCommunityComment 진입');
  
  try {
    const comment_num = parseInt(req.body?.comment_num);
    const user_num = parseInt(req.body?.user_num);

    console.log('1111', comment_num );
    console.log('2222', user_num );
    
    
    const target = await db.Comment.findOne({ where: { comment_num, activate: true } });
      
    if (!target) {
      return res.status(404).json({ msg : '댓글이 이미 삭제되었거나 존재하지 않습니다.' });
    }
    
    if (target.user_num !== user_num) {
      return res.status(403).json({ msg : '댓글 삭제 권한이 없습니다.' });
    }

    const deleteTarget: DeleteTarget = {
      activate : false,
    };

    const result = await db.Comment.update( deleteTarget, {
      where: { comment_num, activate: true }
    });

    if ( !result ) {
      return res.status(404).json({ msg : '삭제할 댓글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ msg : '댓글이 성공적으로 삭제되었습니다.' });

  } catch (err) {
    console.error('Community 댓글 삭제 중 오류가 발생했습니다. :', err);
    res.status(500).json({ msg : 'Community 게시판에 댓글을 삭제하는 중 오류가 발생했습니다.' });
  } 
}