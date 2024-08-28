import express, { Router } from 'express';
import * as controller from '../controller/Csearch';

const router: Router = express.Router();

//공연 상세정보
router.get('/detail/concert', controller.testApi);

//아티스트 상세정보
router.get('/detail/artist', controller.testApi);

//공연 검색 요청
router.get('/concert', controller.testApi);

//아티스트 검색 요청
router.get('/artist', controller.testApi);

//카테고리별 검색기능
router.get('/category', controller.testApi);

export default router;