import express, { Router } from 'express';
import * as controller from '../controller/Cuser';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

router.post('/register', controller.postUser);

router.post('/login', controller.postLogin);

router.post('/logout', auth.authenticateUser, controller.postLogout);

// // router.post('/login/google', controller.postGoogleLogin);
// router.get('/auth/google', controller.getCode);
// router.get('/oauth2/redirect', controller.getRedirect);

// 회원정보 수정
router.patch('/mypage', controller.patchUser);

// 회원탈퇴
router.delete('/ban', controller.deleteUser);

export default router;

