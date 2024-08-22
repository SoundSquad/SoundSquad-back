const { User, UserReview } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client();
const axios = require('axios');
const dotenv = require('dotenv');
const saltRounds = 10; // salt for Bcrypt

// register
exports.postUser = async (req, res) => {
    try {
        const {user_id, user_pw, user_name, user_gender, user_bd} = req.body;
        const hashedPw = bcrypt.hashSync(user_pw, saltRounds);  // hash password
        let profile_img = ''
        if(req.file) {  // only if profile image is uploaded
            profile_img = req.file.path;
        }

        // check id validation
        const userInfo = await User.findOne({
            where: {
                user_id
        }});
        if (userInfo) {
            return res.status(400).json({ 
                flag: false, 
                msg: 'ID already exists' 
            });
        }      
        
        // check password validation
        //
        //
        //

        // create user
        const newUser = await User.create({
            user_id,
            user_name,
            user_pw: hashedPw,
            user_gender,
            user_bd,
            profile_img
        })
        res.json({flag: true, newUser});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


exports.postLogin = async (req, res) => {
    try {
        const {user_id, user_pw} = req.body;
        const user = await User.findOne({
            where: {
                user_id
            }, attributes: ['user_pw', 'user_name']
        });
        if(!user) {
            return res.status(401).json({
                flag: false, 
                msg: "ID does not exists"
            });
        }

        const isPwCorrect = bcrypt.compareSync(user_pw, user.user_pw);
        if(!isPwCorrect) {
            return res.status(401).json({
                flag: false,
                msg: "PW is not correct"
            });
        } else {
            // create jwt token 
            // session
            // 
            //
        }
        res.json({flag: true, user_name: user.user_name})

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


// Mypage -----------------------------------
// delete user
exports.deleteUser = async (req, res) => {
    try {
        const {user_id} = req.body;
        const isDeleted = await User.destroy({
            where: {
                user_id
            }
        });
        if (isDeleted) {
            // session destroy
            //
            // 
            //
        }
        res.json({flag: true});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.patchUser = async (req, res) => {
    try {
        //
        //
        //
        res.json({flag: true});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
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

exports.getCode = async (req, res) => {
    try {
        res.redirect(OAUTH_URL);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

const getToken = async (code) => {
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
      return err;
    }
};

const oauth2Api = async (code) => {
    const accessToken = await getToken(code);
    // NOTE 사용자 정보를 콘솔로 확인
    const userInfo = await getUserInfo(accessToken);
    console.log(userInfo);      
}; 

exports.getRedirect = (req, res) => {
    const query = url.parse(req.url, true).query;
    if (query && query.code) {
        oauth2Api(query.code);

    }
    res.send("");
}



