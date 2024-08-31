import express, { Router } from 'express';
import * as controller from '../controller/Cprofile';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//다른 유저의 정보를 보여주기! /profile/user?user_num=
router.get('/user', controller.getProfileData);



export default router;