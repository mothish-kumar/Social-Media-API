import Profile from "../Models/ProfileModel.js"
import User from "../Models/UserModel.js"

export const getLoggedInProfileController = async (req,res)=>{

    const userId = req.user.userId //get the userId from jwt token
    const userName = req.user.userName
    const profile = await Profile.findOne({userId})
    if(!profile){
        return res.status(404).json({message:'Profile not found'})
    }
    res.status(200).json({
        userName,
        profile
    })
}

export const getUserPorfileByUserIdController = async (req,res)=>{

    const userId = req.params.userId //get the userId from parameter
    const user = await User.findOne({_id:userId})
    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    const profile = await Profile.findOne({userId})
    if(! profile){
        return res.status(404).json({message:'Profile not found'})
    }
    return res.status(200).json({
        userName: user.userName,
        profile:profile
    })

}

export const editProfileController = async (req,res)=>{

    try{
        const {bio,profilePicture,website,socialLinks,interests,visibility,location} = req.body
        const userId = req.user.userId // get the user id from jwt token
        const profile = await Profile.findOne({userId})

        if(!profile){
            return res.status(404).json({message:'User not found'})
        }

        if(bio) profile.bio = bio
        if(profilePicture) profile.profilePicture = profilePicture
        if(website) profile.website = website
        if(socialLinks) profile.socialLinks = socialLinks
        if(interests) profile.interests = interests
        if (visibility && ['public', 'private'].includes(visibility)) profile.visibility = visibility
        if(location) profile.location = location

        await profile.save()
        res.status(200).json(profile)
    }
    catch(error){
        res.status(500).json({message:'Internal server error'})
    }

}