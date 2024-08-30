import express, { Router } from 'express';
import * as controller from '../controller/Creport';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//공연 상세정보

// community 게시글 신고
router.post('/community', controller.testApi);

// comment 신고
router.post('/comment', controller.testApi);

// user 신고 at profile page
router.post('/profile', controller.testApi);

export default router;