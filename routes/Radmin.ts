import express, { Router } from 'express';
import * as controller from '../controller/Cadmin';
import initArtist from '../controller/CartistInit';
import initConcert from '../controller/CconcertInit';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//관리자 페이지 진입
// router.get('/', auth.authenticateAdmin, controller.testApi);

//관리자 검색 - 유저
router.get('/user', auth.authenticateAdmin, controller.getAdminUser);

//관리자 검색 - 댓글
router.get('/comment', auth.authenticateAdmin, controller.getAdminComment);

//관리자 검색 - 게시글
router.get('/community', auth.authenticateAdmin, controller.getAdminCommunity);

//관리자 검색 - 신고목록
router.get('/report', auth.authenticateAdmin, controller.getAdminReport);

//관리자 권한 - 게시글 삭제
router.delete('/community', auth.authenticateAdmin, controller.deleteAdminCommunity);

//관리자 권한 - 유저 삭제
router.delete('/user', auth.authenticateAdmin, controller.deleteAdminUser);

//권리자 권한 - 댓글 삭제
router.delete('/user', auth.authenticateAdmin, controller.deleteAdminComment);

//서버 init 요청
router.get('/initArtists', auth.authenticateAdmin, initArtist);
router.get('/initConcerts', auth.authenticateAdmin, initConcert);
router.get('/rspw', controller.resetPassword );

export default router;