import mongoose from "mongoose"
import dotenv from 'dotenv'
import ms from 'ms'
dotenv.config()

const refreshTokenSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'User',
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
    expiriy :{
        type:Date,
        default:() => new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN))
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken