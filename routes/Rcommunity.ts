import express, { Router } from 'express';
import * as controller from '../controller/Ccommunity';

const router: Router = express.Router();

//커뮤니티 게시판 게시글 보여주기 -> /community/list?page=
router.get('/list', controller.testApi);

//커뮤니티 게시글 등록하기
router.post('/post', controller.testApi);

//커뮤니티 게시글 수정하기
router.patch('/edit', controller.testApi);

//커뮤니티 게시글 삭제하기
router.delete('/delete',controller.testApi);

//커뮤니디 게시글에 댓글을 등록하기
router.post('/comment', controller.testApi);

//댓글 수정하기
router.patch('/comment/edit', controller.testApi);

//댓글 삭제하기
router.patch('/comment/delete', controller.testApi);




export default router;