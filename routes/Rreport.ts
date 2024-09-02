import express, { Router } from 'express';
import * as controller from '../controller/Creport';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//공연 상세정보

// community 게시글 신고
router.post('/community', controller.postReportCommunity);

// comment 신고
router.post('/comment', controller.postReportComment);

// user 신고 at profile page
router.post('/user', controller.postReportUser);

export default router;