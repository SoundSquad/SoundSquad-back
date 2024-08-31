import express, { Router } from 'express';
import * as controller from '../controller/Csquad';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//스쿼드를 리뷰하는 요청
router.post('/review', auth.authenticateUser, controller.testApi);

//스쿼드를 여는 요청
router.post('/', auth.authenticateUser, controller.postOpenSquad);

//스쿼드를 닫는 요청
router.delete('/', auth.authenticateUser, controller.deleteOpenSquad);

//스쿼드에서 다른 유저를 추방하는 요청
router.patch('/', auth.authenticateUser,controller.patchOpenSquad);

//스쿼드에 참여하는 요청
router.post('/member', auth.authenticateUser,controller.postJoinSquad);

//스쿼드에서 떠나는 요청
router.delete('/member', auth.authenticateUser,controller.deleteLeaveSquad);


export default router;