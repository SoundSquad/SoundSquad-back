const express = require('express');
const router = express.Router();
const controller = require('../controller/Cuser');


router.post('/register', controller.postUser);
router.post('/login', controller.postLogin);

// router.post('/login/google', controller.postGoogleLogin);
router.get('/auth/google', controller.getCode);
router.get('/oauth2/redirect', controller.getRedirect);

router.delete('/mypage/delete', controller.deleteUser);
router.patch('/mypage/edit', controller.patchUser);

module.exports = router;