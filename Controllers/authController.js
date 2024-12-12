import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import User from '../Models/UserModel.js'
import RefreshToken from '../Models/RefreshTokenModel.js'
import { generateOTP } from '../Utilities/auth/otpGenerator.js'
import { sendOTP } from '../Utilities/auth/otpSender.js'



dotenv.config()
const SALT = parseInt(process.env.SALT)

export const registerController = async(req,res)=>{
    const {userName,phoneNumber,password,dateOfBirth} = req.body
    try{
        const otp = generateOTP()
        const [genSalt] = await Promise.all([
            bcrypt.genSalt(SALT),
            sendOTP(phoneNumber, otp).catch((err) => console.error("OTP sending failed:", err))
        ]);
        const hashedPassword = await bcrypt.hash(password,genSalt)
        req.session.userData = {
            userName,
            phoneNumber,
            hashedPassword,
            dateOfBirth,
            otp,
            expiration: Date.now() + 10 * 60 * 1000 // OTP expires in 10 minutes
        };
        res.status(200).json({message:'Otp has been send to your mobile number'})
    }
    catch (error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const verifyOTPController = async (req, res) => {
    const { otp } = req.body;

    if (!req.session.userData) {
        return res.status(403).json({ message: 'Session expired or unauthorized action' });
    }

    const { userData } = req.session;

    if (userData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > userData.expiration) {
        return res.status(400).json({ message: 'OTP has expired' });
    }

    try {

        const newUser = new User({
            userName: userData.userName,
            phoneNumber: userData.phoneNumber,
            hashedPassword: userData.hashedPassword,
            dateOfBirth: userData.dateOfBirth,
        });

        await newUser.save()
            delete req.session.userData;
            res.status(200).json({message: 'Registration successfull'});
       
    } catch (error) {
        console.error('Error saving user to database:', error);
        res.status(500).json({ message: 'Internal server error during user registration' });
    }
};


export const loginController = async (req, res) => {
    const { userName, password } = req.body;
    
    try {

        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }


        const accessToken = jwt.sign({ userName: user.userName }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });


        const refreshToken = jwt.sign({ userName: user.userName }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });
        const existingToken = await RefreshToken.findOne({ userId: user._id });

        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            existingToken.expiresAt = Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN);
            await existingToken.save();
        } else {
            const newRefreshToken = new RefreshToken({
                userId: user._id,
                refreshToken,
                expiresAt: Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN),
            });
            await newRefreshToken.save();
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
            maxAge: parseInt(process.env.COOKIE_MAX_AGE)
        });

        return res.status(200).json({
            message: 'Login Successful',
            token:accessToken
        });
        
    } catch (error) {
        console.log('Error during login process:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const refreshTokenController = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({message:'Refresh token is missing'})
    }
    try{
        const storedToken = await RefreshToken.findOne({ refreshToken });
        console.log(storedToken)
        if (!storedToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)
        const newAccessToken = jwt.sign({userName:decoded.userName},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
        return res.status(200).json({message:'Access token refreshed',token:newAccessToken})
    }
    catch(error){
        return res.status(403).json({message:'Invalid or expired refresh token.Please log in again'})
    }
} 

export const forgotPasswordSendOTPController =(req,res)=>{
    const {phoneNumber} = req.body

    const user = User.findOne({phoneNumber:phoneNumber}).then(async()=>{
        if(!user){
            return res.status(404).json({message:"User not found in this phone number"})
        }
        try{
            const otp = generateOTP()
            await sendOTP(phoneNumber,otp)
            req.session.forgotPasswordOTP = {
            otp,
            phoneNumber,
            expiration: Date.now() + 10 * 60 * 1000 // OTP expires in 10 minutes
            };
            return res.status(200).json({message:'OTP send to your phone number'})
        }
        catch(error){
            return res.status(500).json({message:'Internal server error'})
        }
    }).catch((error)=>{
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    })
   
}

export const forgotPasswordVerifyOTPController = (req,res)=>{
    const {otp,phoneNumber} = req.body
    if(!req.session.forgotPasswordOTP || req.session.forgotPasswordOTP.phoneNumber !== phoneNumber){
        return res.status(403).json({message:"Forbidden Action"})
    }
    if (req.session.forgotPasswordOTP.otp === otp && Date.now() <= req.session.forgotPasswordOTP.expiration) {
        req.session.otpVerified = true;
        return res.status(200).json({ message: 'OTP verified successfully'});
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
}

export const resetPasswordController = async (req, res) => {
    const { phoneNumber, newPassword } = req.body

    if (!req.session.otpVerified || req.session.forgotPasswordOTP.phoneNumber !== phoneNumber) {
        return res.status(400).json({ message: 'OTP verification required' })
    }

    const user = await User.findOne({phoneNumber:phoneNumber})

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    try {
        const genSalt = await bcrypt.genSalt(SALT)
        const hashedPassword = await bcrypt.hash(newPassword, genSalt)

        user.hashedPassword = hashedPassword
        await user.save();

        req.session.forgotPasswordOTP = null;
        req.session.otpVerified = false;

        return res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error('Error resetting password:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
} 

export const logoutController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ message: 'No user logged in' });
        }


        const deletedToken = await RefreshToken.findOneAndDelete({ refreshToken });

        if (!deletedToken) {
            return res.status(400).json({ message: 'No user logged in' });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};