const mongoose  = require('mongoose')
const {isEmail} = require('validator')
const Schema =  mongoose.Schema

const userSchema = new Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validator : [isEmail, 'please check your email']
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
})


const User = mongoose.model('User', userSchema)

module.exports.User = User;