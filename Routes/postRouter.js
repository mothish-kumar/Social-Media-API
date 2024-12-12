import express from 'express'
import { authJWT } from '../Middlewares/authJWTMiddleware.js'
import { createPostController, deletePostController, getAllPostController, getPostController, updatePostController } from '../Controllers/postController.js'

const router = express.Router()

router.post('/',authJWT,createPostController)
router.get('/:post_id',getPostController)
router.put('/:post_id',authJWT,updatePostController)
router.delete('/:post_id',authJWT,deletePostController)
router.get('/',getAllPostController)

export default router