import express from 'express'
import { editProfileController, getLoggedInProfileController, getUserPorfileByUserIdController } from '../Controllers/profileController.js'
import { authJWT } from '../Middlewares/authJWTMiddleware.js'

const router = express.Router()

router.get('/',authJWT,getLoggedInProfileController)
router.put('/',authJWT,editProfileController)
router.get('/:userId',getUserPorfileByUserIdController)

export default router