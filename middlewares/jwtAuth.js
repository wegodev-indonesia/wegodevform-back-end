import JWT from 'jsonwebtoken'
import dotenv from "dotenv"
const env = dotenv.config().parsed;

const jwtAuth = () => {
    return function(req, res, next) {  
        try{
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1]

                JWT.verify(token, env.JWT_ACCESS_TOKEN_SECRET, (err, data) => {
                    if (err) {
                        if(err.name == 'TokenExpiredError'){
                            throw 'TOKEN_EXPIRED'
                        } else {
                            throw 'TOKEN_IS_NOT_VALID'
                        }
                    } else { 
                        req.JWT = data
                        next()
                    }
                })
            } else {
                throw 'TOKEN_REQUIRED'
            }
        } catch(err) {
            return res.status(401).json({
                success : false,
                message : err
            })
        }
    }
}

export default jwtAuth