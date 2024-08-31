import express, { Router } from 'express';
import * as controller from '../controller/Cmypage';
import * as auth from '../middleware/auth';

const router: Router = express.Router();


// 마이페이지 진입시 유저 정보 출력하기 -> /mypage/user?user_num=
router.get('/user', controller.getMypageUserInfo);

// 마이페이지 작성한 공연 리뷰를 페이징처리 해서 보여주기 /mypage/review?user_num=&page=
router.get('/review', controller.testApi);

// 마이페이지에서 참여한 스쿼드 정보를 보여주기 /mypage/squad?user_num=&page=
router.get('/squad', controller.testApi);

// 마이페이지에서 작성한 커뮤니티 게시글을 보여주기 /mypage/community?user_num=&page=
router.get('/community', controller.getMypagePost);

// 마이페이지에서 작성한 댓글을 보여주기 /mypage/comment?user_num=&page=
router.get('/comment', controller.getMypageComment);

export default router;