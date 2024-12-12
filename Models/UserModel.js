import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    userName: { 
        type: String,
        required: true,
        unique: true 
    },
    phoneNumber: { 
        type: String,
        required: true,
        unique: true 
    },
    hashedPassword: { 
        type: String,
        required: true 
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    createdAt:{
        type:Date,
        dafault:Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;