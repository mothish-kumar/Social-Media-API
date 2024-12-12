import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' })
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}
