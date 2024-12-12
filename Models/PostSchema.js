import mongoose from "mongoose";
import User from "./UserModel.js";

const PostSchema = mongoose.Schema({

    userId:{
    type:mongoose.Schema.ObjectId,
    ref:User,
    required:true
    },
    content:{
        type:String
    },
    image:{
        type : String
    },
    likes:{
        type:[mongoose.Schema.ObjectId],
        ref:User
    },
    comments:[
        {
            userId:{
                type:mongoose.Schema.ObjectId,
                ref:User,
                required:true
            },
            comment:{
                type:String,
                require:true
            },
            createAt:{
                type:Date,
                default:Date.now
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const Post = mongoose.model('Post',PostSchema)
export default Post