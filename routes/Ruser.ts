import express, { Router } from 'express';
import * as controller from '../controller/Cuser';

const router: Router = express.Router();

router.post('/register', controller.postUser);
router.post('/login', controller.postLogin);

// router.post('/login/google', controller.postGoogleLogin);
router.get('/auth/google', controller.getCode);
router.get('/oauth2/redirect', controller.getRedirect);

router.delete('/mypage/delete', controller.deleteUser);
router.patch('/mypage/edit', controller.patchUser);

export default router;