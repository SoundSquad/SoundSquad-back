import express, { Router } from 'express';
import * as controller from '../controller/Cuser';
import initController from '../controller/CartistInit';

const router: Router = express.Router();

router.post('/register', controller.postUser);
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);

// router.post('/login/google', controller.postGoogleLogin);
router.get('/auth/google', controller.getCode);
router.get('/oauth2/redirect', controller.getRedirect);

// 회원정보 수정
router.patch('/mypage', controller.patchUser);
// 회원탈퇴
router.delete('/ban', controller.deleteUser);

router.get('/initArtists', initController);



export default router;

