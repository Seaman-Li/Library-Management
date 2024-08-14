import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,},
    nickame:{type:String,},
    password:{type:String},
    role:{type: String, enum: ['user', 'admin'], default: 'user' },
});

// const User = mongoose.model('User',userSchema)

export default userSchema;