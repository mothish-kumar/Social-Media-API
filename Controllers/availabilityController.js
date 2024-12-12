import User from '../Models/UserModel.js'

export const checkUsernameAvailability = async (req,res)=>{
    const {userName} = req.body
    if(!userName){
        return res.status(400).json({message:'User Name is required'})
    }
    try{
        const user = await User.findOne({userName})
        if(user){
            console.log(user)
            return res.status(400).json({message:'User Name is already taken'})
        }
        return res.status(200).json({message:'User Name is available'})
    }
    catch(error){
        return res.status(500).json({message:'Internal Server Error'})
    }
}

export const checkPhoneNumberAvailability = async (req,res)=>{
    const {phoneNumber} = req.body
    if(!phoneNumber){
        return res.status(400).json({message:'Phone Number is required'})
    }
    try{
        const user = await User.findOne({phoneNumber})
        if(user){
            return res.status(400).json({message:'Phone Number is already take'})
        }
        return res.status(200).json({message:'Phone Number is available'})
    }
    catch(error){
        return res.status(500).json({message:'Internal Server Error'})
    }
}