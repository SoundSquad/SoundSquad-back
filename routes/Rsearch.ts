import express, { Router } from 'express';
import * as controller from '../controller/Csearch';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//공연 상세정보
router.get('/detail/concert', controller.testApi);

//공연 상세정보 스쿼드 목록 
router.get('/detail/concert/squad', controller.testApi);

//아티스트 상세정보 
router.get('/detail/artist', controller.testApi);

//아티스트 상세정보 리뷰 목록
router.get('/detail/artist/review', controller.testApi);

//공연 검색 요청
router.get('/concert', controller.searchConcert);

//아티스트 검색 요청
router.get('/artist', controller.searchArtist);

//카테고리별 검색기능 - 아티스트
router.get('/category/artist', controller.searchCategoryArtist);

//카테고리별 검색기능 - 공연
router.get('/category/concert', controller.searchCategoryConcert);

export default router;