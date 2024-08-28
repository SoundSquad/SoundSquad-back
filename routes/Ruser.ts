import express, { Router } from 'express';
import * as controller from '../controller/Cuser';
import initController from '../controller/CartistInit';

const router: Router = express.Router();

router.post('/register', controller.postUser);
router.post('/login', controller.postLogin);

// router.post('/login/google', controller.postGoogleLogin);
router.get('/auth/google', controller.getCode);
router.get('/oauth2/redirect', controller.getRedirect);

router.delete('/mypage/delete', controller.deleteUser);
router.patch('/mypage/edit', controller.patchUser);



// 임시
router.get('/initArtist', initController.getArtistsInit);

export default router;