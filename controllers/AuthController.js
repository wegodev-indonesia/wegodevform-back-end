import User from '../models/User.js'
import emailExist from '../libraries/emailExist.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: env.JWT_ACCESS_TOKEN_LIFE }
    );
}

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: env.JWT_REFRESH_TOKEN_LIFE }
    );
}

class AuthController {
    async register(req, res) {
        try{
            if(!req.body.fullname) { throw { code: 428, message: "Fullname is required" } }
            if(!req.body.email) { throw { code: 428, message: "Email is required" } }
            if(!req.body.password) { throw { code: 428, message: "Password is required" } }
            
            //check if password match
            if(req.body.password !== req.body.retype_password) { 
                throw { code: 428, message: "PASSWORD_NOT_MATCH" } 
            }

            //check is email exist
            const isEmailExist = await emailExist(req.body.email);
            if(isEmailExist) { throw { code: 409, message: "EMAIL_EXIST" } }

            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({ 
                fullname: req.body.fullname,
                email: req.body.email,
                password: hash,
            });
            const user = await newUser.save();

            if(!user) { throw { code: 500, message: "USER_REGISTER_FAILED" } }

            return res.status(200).json({ 
                status: true,
                message: 'USER_REGISTER_SUCCESS',
                user
            });
        } catch (err){
            if(!err.code) { err.code = 500 }
            return res.status(err.code).json({ 
                status: false,
                message: err.message 
            });
        }
    }

    async login(req, res) {
        try{
            if(!req.body.email) { throw { code: 428, message: "Email is required" } }
            if(!req.body.password) { throw { code: 428, message: "Password is required" } }
            
            //check is email exist
            const user = await User.findOne({ email: req.body.email });
            if(!user) { throw { code: 403, message: "EMAIL_NOT_FOUND" } }
            
            //check is password match
            const isMatch = await bcrypt.compareSync(req.body.password, user.password);
            if(!isMatch) { throw { code: 403, message: "WRONG_PASSWORD" } }        

            //generate token
            const payload =  { id: user._id, role: user.role };
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            return res.status(200).json({ 
                status: true,
                message: 'LOGIN_SUCCESS',
                fullname: user.fullname,
                accessToken,
                refreshToken
            });
        } catch (err) {
            if(!err.code) { err.code = 500 }
            return res.status(err.code).json({ 
                status: false,
                message: err.message 
            });
        }
    }

    async refreshToken(req, res) {
        try{
            if(!req.body.refreshToken) { throw { code: 428, message: "Refresh Token is required" } }

            //verify token
            const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);
            
            //generate token
            let payload =  { id: verify.id, role: verify.role };
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            return res.status(200).json({ 
                status: true,
                message: 'REFRESH_TOKEN_SUCCESS',
                accessToken,
                refreshToken
            });
        } catch (err){
            if(!err.code) { err.code = 500 }

            if(err.message === 'jwt expired') {
                err.message = 'REFRESH_TOKEN_EXPIRED'
            } else if(err.message === 'invalid signature' || err.message === 'invalid token') {
                err.message = 'REFRESH_TOKEN_INVALID'
            }

            return res.status(err.code).json({ 
                status: false,
                message: err.message 
            });
        }
    }
}

export default new AuthController();