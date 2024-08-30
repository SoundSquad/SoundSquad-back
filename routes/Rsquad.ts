import express, { Router } from 'express';
import * as controller from '../controller/Csquad';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

router.get('/list', controller.testApi);

router.post('/review', controller.testApi);

router.post('/opensquad', controller.testApi);

export default router;