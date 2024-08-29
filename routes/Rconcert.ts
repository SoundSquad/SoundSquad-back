import express, { Router } from 'express';
import * as controller from '../controller/Cconcert';

const router: Router = express.Router();

//공연에 대한 리뷰 작성 가능 /concert/review
router.post('/review', controller.testApi);


export default router;