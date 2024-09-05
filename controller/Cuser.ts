import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import axios from 'axios';
import dotenv from 'dotenv';
import url from 'url';
import { UpdatedUserFields, UpdatedPasswordFields ,findSquadInfoReturn, userReviewObj , postUserFields } from '../modules/Muser';
import logger from '../config/loggerConfig';


dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS as string) || 10 ; // salt for Bcrypt

// 회원가입
export const postUser = async (req: Request, res: Response) => {
    try {
        
        const { user_id, user_pw, user_gender, user_bd } = req.body;
        const hashedPw = bcrypt.hashSync(user_pw, saltRounds);
        let profile_img : string = '';

        if(!user_id||!user_pw||!user_gender||!user_bd){
            logger.error(' postUser - 400 ', req.body );
            return res.status(400).json({  
                flag: false, 
                msg : '필수 정보가 누락되었습니다.' 
            });
        }

        const userInfo = await db.User.findOne({
            where: { user_id }  
        });
        
        if (userInfo) {
            logger.error(' postUser - 400');
            return res.status(400).json({ 
                flag: false, 
                msg: 'ID already exists' 
            });
        }      
        
        const newUser = await db.User.create({
            user_id,
            user_pw: hashedPw,
            user_gender,
            user_bd,
            profile_img
        });

        logger.info(' postUser - 201');
        return res.status(201).json({ msg : 'success', flag: true });
    
    } catch (err) {
        logger.error(' postUser - 500');
        console.error(err);
        return res.status(500).json({ msg :'Internal Server Error'});
    }
};

// 로그인
export const postLogin = async (req: Request, res: Response) => {
    try {
        const { user_id, user_pw } = req.body;
        if( !user_id || !user_pw ){
            logger.info(' postLogin - 400', req.body);
            return res.status(400).json({ msg : '필수 정보가 누락되었습니다.' });
        }
        
        const user = await db.User.findOne({
            where: { user_id },
            attributes: ['user_pw', 'user_id', 'activate', 'user_num']
        });
        if (!user) {
            logger.error(' postUser - 401');
            return res.status(401).json({
                flag: false, 
                msg: "ID does not exists"
            });
        }

        const user_num = user.user_num;

        const isPwCorrect = bcrypt.compareSync(user_pw, user.user_pw);
        
        if (!isPwCorrect) {
            logger.error(' postUser - 401');
            return res.status(401).json({
                flag: false,
                msg: "PW is not correct"
            });
        } 
        
        if (!user.activate) {
            logger.error(' postUser - 401');
            return res.status(401).json({
                flag: false,
                msg: "Deactivated User"
            });
        }

        // 일반/admin 계정인지 확인 --> if 문 조건 수정 필요!! (현재는 admin의 아이디가 1이라고 가정)
        if (user_num === parseInt( process.env.ADMIN_ID as string )) {  // admin 계정일때 
            (req.session as any).user = {
                user_id: user.user_id,  // string
                user_num: user.user_num,  // number
                admin: true  // boolean
            };
            (req.session as any).loggedin = true;  // boolean
            logger.info(' postUser - 200');
            return res.status(200).json({ 
                flag: true,
                msg: "success"
            });
        } else {  // 일반 user일때
            (req.session as any).user = {
                user_id: user.user_id,  // string
                user_num: user.user_num,  // number
                admin: false  // boolean
            };
            (req.session as any).loggedin = true;  // boolean

            const squadReviewInfo = findSqaudInfo(user.user_num); // 해당 유저의 squad review 정보
            logger.info(' postUser - 200');
            return res.json({
                flag: true,
                msg: "success",
                user_num,
                count : squadReviewInfo
            });
        }
        
    } catch (err) {
        logger.error(' postUser - 500');
        console.error(err);
        res.status(500).json({msg : 'Internal Server Error'});
    }
};

// 해당 유저와 관련된 squad review 정보 return
const findSqaudInfo = async (user_num:number) => {
    try {
        let result:findSquadInfoReturn = {
            msg: "success",
            userReviewList: []
        };

        const squad = await db.SquadInfo.findAll({
            where: {
                [Op.or]: [
                    { opener_num: user_num },
                    { member_num: user_num }
                ]
            }, attributes: ['squad_num', 'concert_num']
        });

        // 참여한 squad가 없을 때
        if (!squad) {
            result.msg = "no squad";
            result.userReviewList.push();
            return result;
        }

        // squad에서 squad_num을 뽑아서 array화
        const squadNumList = squad.map((s) => {
            return s.squad_num;
        });

        const userReview = await db.UserReview.findAll({
            where: {
                squad_num: { [Op.in]: squadNumList }
            }
        });
        
        // squad에 참여했지만 review를 하나도 작성하지 않았을 때
        if (!userReview) {
            result.msg = "no reviews";
            return 0;
        }

        userReview.forEach((review) => {
            let writer:boolean;
            let other_user:number;
            if (review.writer_num == user_num) { // 해당 리뷰의 작성자(평가자)일때
                writer = true; 
                other_user = review.reviewed_user;
            } else {
                writer = false;
                other_user = review.writer_num;
            }
            const userReview:userReviewObj = {
                concert_num: review.concert_num,
                writer,
                other_user: other_user, 
                rating: review.rating,
                // created_at: review.created_at
            }

            result.userReviewList.push(userReview);
        })
        logger.error(' findSqaudInfo - 404');
        return result.userReviewList.length;

    } catch (err) {
        console.error(err);
    }
}

// 로그아웃
export const postLogout = async (req: Request, res: Response) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                logger.error('postLogout - 500');
                return res.status(500).json({ msg: 'fail' });
            }
            
            res.clearCookie('connect.sid');
            logger.info('postLogout - 200');
            return res.status(200).json({ msg: 'success' });
        });
    } catch (err) {
        logger.error('postLogout - 500');
        console.error(err);
        res.status(500).json({ msg: 'fail' });
    }
}

// Mypage -----------------------------------
// delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { user_num } = req.body;

        if(!user_num){
            logger.error(' deleteUser - 204', req.body );
            return res.status(400).json({ msg : ' 필수 정보가 누락되었습니다. ' });
        }

        if(user_num === parseInt(process.env.ADMIN_ID as string)){
            logger.error(' deleteUser - 403');
            return res.status(403).json({ msg: 'can not delete user' });    
        }

        if (user_num !== (req.session as any).user?.user_num) {
            logger.error(' deleteUser - 403');
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        const [updatedRows] = await db.User.update(
            { activate: false },
            { where: { user_num } }
        );

        if (!updatedRows) {
            logger.error(' deleteUser - 404');
            return res.status(404).json({ msg: 'User not found' });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                logger.error(' deleteUser - 500');
                return res.status(500).json({ msg: 'Internal server error' });
            }
            res.clearCookie('connect.sid');
            logger.info(' deleteUser - 204');
            res.json({ msg: 'User deactivated successfully' });
        });

    } catch (err) {
        logger.error(' deleteUser - 500');
        console.error('User deletion error:', err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


export const patchUser = async (req: Request, res: Response) => {
    try {
        const isLogin = (req.session as any ).loggedin || 0 ;
        
        if (!isLogin) {
            logger.error(' patchUser - 401 ', req.session );
            return res.status(401).json({ msg: "Not logged in" });
        }

        const { user_num, prefer_genre, mbti, introduce, user_gender, user_bd } = req.body;
    
        const user = await db.User.findOne({
            where: { user_num },
        });

        if (!user) {
            logger.error(' patchUser - 404');
            return res.status(404).json({ msg: "User not found" });
        }

        let updatedFields: UpdatedUserFields = {
            prefer_genre : prefer_genre || user.prefer_genre,
            mbti : mbti || user.mbti,
            introduce : introduce || user.introduce,
            user_gender : user_gender || user.user_gender,
            user_bd : user_bd || user.user_bd
        };

        // Handle profile image

        const [updateCount] = await db.User.update(updatedFields, {
            where: { user_num }
        });

        if (updateCount > 0) {
            logger.info(' patchUser - 201');
            return res.json({ msg: "success" });
        } else {
            logger.error(' patchUser - 400');
            return res.status(400).json({ msg: "No changes made" });
        }
            
    } catch (err) {
        logger.error(' patchUser - 500');
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const patchPassword= async (req: Request, res: Response) => {
    try {
        const { user_num, old_pw, new_pw } = req.body;

        const user = await db.User.findOne({
            where: { user_num },
        });

        if(!user){
            logger.info('patchPassword - 404' );
            return res.status(404).json({ msg : '대상을 찾을 수 없습니다.' });    
        }

        if(!old_pw || !new_pw ){
            logger.info('patchPassword - 400', req.body );
            return res.status(400).json({ msg : '필수 정보가 누락되었습니다.' });
        }

        let updatedFields: UpdatedPasswordFields = {};

        // Handle profile image
        if (req.file) {
            updatedFields.user_pw = new_pw;
        }

        // Handle password change
        if (new_pw && old_pw) {
            const isPwCorrect = bcrypt.compareSync(old_pw, user.user_pw);
            if (isPwCorrect) {
                const hashedPw = bcrypt.hashSync(new_pw, parseInt(process.env.SALT_ROUNDS as string ));
                updatedFields.user_pw = hashedPw;
            } else {
                logger.error(' patchUser - 400');
                return res.status(400).json({
                    flag: false,
                    msg: "Incorrect password"
                });
            }
        }
        
        await db.User.update(updatedFields, {
            where: { user_num }
        });
        
        logger.info(' patchUser - 201');
        return res.status(201).json({ msg: "success" });

    } catch (err) {
        logger.error(' patchPassword - 500');
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}


// // -------------------
// // Google Oauth

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
// const REDIRECT_URL = "http://localhost:8080/api/oauth2/redirect";
// const RESPONSE_TYPE = "code";
// const SCOPE = "openid%20profile%20email";
// const ACCESS_TYPE = "offline";
// const OAUTH_URL = `${AUTHORIZE_URI}?client_id=${CLIENT_ID}
//             &response_type=${RESPONSE_TYPE}
//             &redirect_uri=${REDIRECT_URL}
//             &scope=${SCOPE}
//             &access_type=${ACCESS_TYPE}`;

// export const getCode = async (req: Request, res: Response) => {
//     try {
//         res.redirect(OAUTH_URL);
//     } catch (err) {
//         res.status(500).send('Internal Server Error');
//     }
// };

// const getToken = async (code: string): Promise<string> => {
//     try {
//       const tokenApi = await axios.post(`https://oauth2.googleapis.com/token
//         ?code=${code}
//         &client_id=${CLIENT_ID}
//         &client_secret=${CLIENT_SECRET}
//         &redirect_uri=${REDIRECT_URL}
//         &grant_type=authorization_code`);
//       const accessToken = tokenApi.data.access_token;
//       console.log(accessToken);
//       return accessToken;
//     } catch (err) {
//       throw err;
//     }
// };

// const oauth2Api = async (code: string) => {
//     const accessToken = await getToken(code);
//     // NOTE 사용자 정보를 콘솔로 확인
//     // const userInfo = await getUserInfo(accessToken);
//     // console.log(userInfo);      
// }; 

// export const getRedirect = (req: Request, res: Response) => {
//     const query = url.parse(req.url, true).query;
//     if (query && query.code) {
//         oauth2Api(query.code as string);
//     }
//     res.send("");
// };