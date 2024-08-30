import express, { Router } from 'express';
import * as controller from '../controller/Cadmin';
import initController from '../controller/CartistInit';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//관리자 페이지 진입
router.get('/', controller.testApi);

//관리자 검색 -유저
router.get('/user', controller.testApi);

//관리자 검색 - 신고목록
router.get('/report', controller.testApi);

//관리자 검색 -게시글
router.get('/community', controller.testApi);

//관리자 권한 - 게시글 삭제
router.delete('/community', controller.testApi);

//관리자 권한 - 유저 삭제
router.delete('/user', controller.testApi);


//init 인증
router.get('/initArtists', initController);


export default router;