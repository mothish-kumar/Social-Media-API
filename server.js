import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './db.js'
import authRouter from './Routes/authRouter.js'
import profileRouter from './Routes/profileRouter.js'
import postRouter from './Routes/postRouter.js'
import { startTokenCleanupTask } from './tasks/refreshTokenCleanUp.js'
import { checkUsernameAvailability, checkPhoneNumberAvailability } from './Controllers/availabilityController.js';
import {validateUserNameAvailability,validatePhoneNumberAvailability,handleValidationErrors} from './Middlewares/availabilityInputValidator.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))


const PORT = parseInt(process.env.PORT)
connectDB()

app.use('/auth',authRouter)
app.post('/check-user-name',validateUserNameAvailability,handleValidationErrors,checkUsernameAvailability)
app.post('/check-phone-number',validatePhoneNumberAvailability,handleValidationErrors,checkPhoneNumberAvailability)
// authAWT middlware insertion for production
app.use('/profiles',profileRouter)
app.use('/posts',postRouter)

startTokenCleanupTask();

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`
    )})