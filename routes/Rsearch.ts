import express, { Router } from 'express';
import * as controller from '../controller/Csearch';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//공연 상세정보
router.get('/detail/concert', controller.getDetailConcert);

//공연 상세정보 스쿼드 목록 
router.get('/detail/concert/squad', controller.getDetailConcertSquad);

//아티스트 상세정보 
router.get('/detail/artist', controller.getDetailArtist);

//아티스트 상세정보 리뷰 목록
router.get('/detail/artist/review', controller.getDetailArtistReview);

//공연 검색 요청
router.get('/concert', controller.searchConcert);

//아티스트 검색 요청
router.get('/artist', controller.searchArtist);

//커뮤니티 게시글 검색 - 제목
router.get('/community/titlelist', controller.getSearchCommunityList);

//커뮤니티 게시글 카테고리
router.get('/community/categorylist', controller.getCategoryCommunityList);

//카테고리별 검색기능 - 아티스트
router.get('/genre/artist', controller.searchCategoryArtist);

//카테고리별 검색기능 - 공연
router.get('/genre/concert', controller.searchCategoryConcert);

router.get('/main',controller.getSearchMain);

router.get('/genre',controller.getGenreList);


export default router;