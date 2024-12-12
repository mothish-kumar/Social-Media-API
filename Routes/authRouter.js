import express from 'express'
import { forgotPasswordSendOTPController, loginController, logoutController, refreshTokenController, registerController, resetPasswordController, verifyOTPController,forgotPasswordVerifyOTPController} from '../Controllers/authController.js'
import {validateRegistration,validateLogin,validateForgotPassword,handleValidationErrors} from '../Middlewares/authInputValidatorMiddleware.js'

const router = express.Router()

router.post('/register',validateRegistration,handleValidationErrors,registerController)
router.post('/register/verify-otp',verifyOTPController)
router.post('/login',validateLogin,handleValidationErrors,loginController)
router.post('/refresh-token',refreshTokenController)
router.post('/forgot-password/send-otp',validateForgotPassword,handleValidationErrors,forgotPasswordSendOTPController)
router.post('/forgot-password/verify-otp',validateForgotPassword,handleValidationErrors,forgotPasswordVerifyOTPController)
router.put('/forgot-password/reset-password',resetPasswordController)
router.post('/logout',logoutController)

export default router