import express, { Router } from 'express';
import * as controller from '../controller/Csquad';
import * as auth from '../middleware/auth';

const router: Router = express.Router();

//스쿼드 목록을 불러오는 요청
router.get('/list', controller.testApi);

//스쿼드를 리뷰하는 요청
router.post('/review', controller.testApi);

//스쿼드를 여는 요청
router.post('/', controller.postOpenSquad);

//스쿼드를 닫는 요청
router.delete('/', controller.deleteOpenSquad);

//스쿼드에서 다른 유저를 추방하는 요청
router.patch('/',controller.patchOpenSquad);

//스쿼드에 참여하는 요청
router.post('/member',controller.postJoinSquad);

//스쿼드에서 떠나는 요청
router.delete('/member',controller.deleteLeaveSquad);


export default router;