import express, { Router } from 'express';
import * as controller from '../controller/Ccommunity';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//커뮤니티 게시판 게시글 보여주기 -> /community/list?page=
router.get('/list', controller.getCommunityPosts);

//커뮤니티 게시글 단일 조회하기 ->
router.get('/detail', controller.getCommunityPost);

//커뮤니티 게시글 단일 조회하기 ->
router.get('/detail/comment', controller.getCommunityPostCommentList);

//커뮤니티 게시글 등록하기
router.post('/', auth.authenticateUser, controller.postCommunityPost);

//커뮤니티 게시글 수정하기
router.patch('/', auth.authenticateUser, controller.patchCommunityPost);

//커뮤니티 게시글 삭제하기
router.delete('/', auth.authenticateUser, controller.deleteCommunityPost);

//커뮤니디 게시글에 댓글을 등록하기
router.post('/comment', auth.authenticateUser, controller.postCommunityComment);

//댓글 수정하기
router.patch('/comment', auth.authenticateUser, controller.patchCommunityComment);

//댓글 삭제하기
router.delete('/comment', auth.authenticateUser, controller.deleteCommunityComment);

export default router;