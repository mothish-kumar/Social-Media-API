import Post from "../Models/PostSchema.js"

export const createPostController = async(req,res)=>{
    const userId = req.user.userId
    const {content,image} = req.body
   try{
    const newPost = new Post({
        userId:userId,
        content:content,
        image:image
    })
    await newPost.save()
    return res.status(200).json({
        message:'Post has been successfully created',
        postId:newPost._id
    })
   }
   catch(error){
    return res.status(500).json({message:'Internal server error'})
   }
}

export const getPostController = (req,res)=>{

}

export const updatePostController = (req,res)=>{

}

export const deletePostController = (req,res)=>{

}

export const getAllPostController = (req,res)=>{

}