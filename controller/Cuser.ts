import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import axios from 'axios';
import dotenv from 'dotenv';
import url from 'url';
import { updatedFields, findSquadInfoReturn, userReviewObj } from '../modules/user';


dotenv.config();

const saltRounds = 10; // salt for Bcrypt

// 회원가입
export const postUser = async (req: Request, res: Response) => {
    try {
        const { user_id, user_pw, user_gender, user_bd } = req.body;
        const hashedPw = bcrypt.hashSync(user_pw, saltRounds);
        let profile_img = '';

        const userInfo = await db.User.findOne({
            where: { user_id }
        });
        if (userInfo) {
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
        res.json({ flag: true, newUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// 로그인
export const postLogin = async (req: Request, res: Response) => {
    try {
        const { user_id, user_pw } = req.body;
        const user = await db.User.findOne({
            where: {
                user_id
            }, 
            attributes: ['user_pw', 'user_name', 'activate']
        });
        if (!user) {
            return res.status(401).json({
                flag: false, 
                msg: "ID does not exists"
            });
        }

        const isPwCorrect = bcrypt.compareSync(user_pw, user.user_pw);
        if (!isPwCorrect) {
            return res.status(401).json({
                flag: false,
                msg: "PW is not correct"
            });
        } 
        
        if (!user.activate) {
            return res.status(401).json({
                flag: false,
                msg: "Deactivated User"
            });
        }

        // 일반/admin 계정인지 확인 --> if 문 조건 수정 필요!! (현재는 admin의 아이디가 1이라고 가정)
        if (user_id === "1") {  // admin 계정일때 
            req.session.user = {
                user_id: user.user_id,  // string
                user_num: user.user_num,  // number
                admin: true  // boolean
            };
            req.session.loggedin = true;  // boolean
            return res.json({ 
                flag: true,
                msg: "success"
            });
        } else {  // 일반 user일때
            req.session.user = {
                user_id: user.user_id,  // string
                user_num: user.user_num,  // number
                admin: false  // boolean
            };
            req.session.loggedin = true;  // boolean

            const squadReviewInfo = findSqaudInfo(user.user_num); // 해당 유저의 squad review 정보
            return res.json({ 
                flag: true,
                msg: "success",
                squadReviewInfo
            });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
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
            return result;
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
        return result;

        // ===== result 구조 =====
        // result = {
        //     msg: string,
        //     userReviewList: {
        //         [
        //             {
        //                 concert_num: number,
        //                 writer: boolean,
        //                 other_user: number,
        //                 rating: number,
        //                 created_at: string
        //             }, ...
        //         ]
        //     }
        // }
        // --------
        // msg = "no squad" or "no review" or "success"
        // writer = review의 작성자면 true 
        // other_user = 나 말고 squad에 참여한 다른 사람
        // =====================


    } catch (err) {
        console.error(err);
    }
}

// 로그아웃
export const postLogout = async (req: Request, res: Response) => {
    try {
        // delete session
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'fail' });
            } else {
                res.json({ msg: 'success' });
            }
            res.clearCookie('connect.sid'); 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'fail' });
    }
}

// Mypage -----------------------------------
// delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const isDeleted = await db.User.update({
            activate: false
        }, {
            where: {
                user_id
            }
        });
        if (isDeleted) {
            // session destroy
            req.session.destroy(err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'fail' });
                } else {
                    res.json({ msg: 'success' });
                }
                res.clearCookie('connect.sid'); 
            });
        }
        res.json({ msg: 'fail' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

export const patchUser = async (req: Request, res: Response) => {
    try {
        const isLogin = req.session.loggedin;
        if(isLogin) {
            const { user_id, old_pw, new_pw, prefer_genre, mbti } = req.body;
        
            const user = await db.User.findOne({
                where:{
                    user_id
                },
                attributes:['user_pw', 'profile_img']
            });

            // 프로필 이미지 초기화
            let profile_img;
            // 파일이 업로드 된 경우에만 경로 설정
            if(req.file){
                profile_img = req.file.path;
            } else {
                profile_img = user.profile_img
            }
            
            let updatedFields:updatedFields = {
                profile_img
            };

            // 비밀번호 변경 여부 확인
            if (new_pw && old_pw) { // 새 비밀번호와 기존 비밀번호가 모두 존재하는 경우에만 비밀번호 업데이트
                const isPwCorrect = bcrypt.compareSync(old_pw, user.user_pw);

                if (isPwCorrect) {
                    const hashedPw = bcrypt.hashSync(new_pw, saltRounds);
                    updatedFields.user_pw = hashedPw;
                } else {
                    return res.json({
                        flag: false,
                        msg: "wrong password"
                    }); // 비밀번호가 일치하지 않을 경우 처리
                }
            }

            // prefer_genre가 수정된다면
            if (prefer_genre) {
                updatedFields.prefer_genre = prefer_genre;
            }

            // mbti가 수정된다면
            if (mbti) {
                updatedFields.mbti = mbti;
            }

            const isUpdated = await db.User.update(updatedFields, {
                where: { user_id }
            });

            if (isUpdated) {
                return res.json({ msg: "success" }); // 성공적으로 업데이트된 경우 처리
            } else {
                return res.json({ msg: "fail" }); // 성공적으로 업데이트된 경우 처리
            }
        }
            
            
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "fail" });
    }
};

export const patchSquadinfo = async (req: Request, res: Response) => {
    try {

    } catch (err) {

    }
}


// -------------------
// Google Oauth

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URL = "http://localhost:8080/api/oauth2/redirect";
const RESPONSE_TYPE = "code";
const SCOPE = "openid%20profile%20email";
const ACCESS_TYPE = "offline";
const OAUTH_URL = `${AUTHORIZE_URI}?client_id=${CLIENT_ID}
            &response_type=${RESPONSE_TYPE}
            &redirect_uri=${REDIRECT_URL}
            &scope=${SCOPE}
            &access_type=${ACCESS_TYPE}`;

export const getCode = async (req: Request, res: Response) => {
    try {
        res.redirect(OAUTH_URL);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

const getToken = async (code: string): Promise<string> => {
    try {
      const tokenApi = await axios.post(`https://oauth2.googleapis.com/token
        ?code=${code}
        &client_id=${CLIENT_ID}
        &client_secret=${CLIENT_SECRET}
        &redirect_uri=${REDIRECT_URL}
        &grant_type=authorization_code`);
      const accessToken = tokenApi.data.access_token;
      console.log(accessToken);
      return accessToken;
    } catch (err) {
      throw err;
    }
};

const oauth2Api = async (code: string) => {
    const accessToken = await getToken(code);
    // NOTE 사용자 정보를 콘솔로 확인
    // const userInfo = await getUserInfo(accessToken);
    // console.log(userInfo);      
}; 

export const getRedirect = (req: Request, res: Response) => {
    const query = url.parse(req.url, true).query;
    if (query && query.code) {
        oauth2Api(query.code as string);
    }
    res.send("");
};