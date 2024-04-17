
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')

const maxAge = 3 * 24 * 60 * 60 // secounds of three days
const createToken = (id) =>{
   return jwt.sign({id}, 'fidel secretkey', {
    expiresIn: maxAge
   });
}

module.exports.signup_get = async(req, res) =>{
    res.render('register');
    
}

module.exports.login_get = async(req, res) =>{
    res.render('login')

}

module.exports.signup_post = async(req, res) =>{
 
    const {email , password} = req.body;
    try {
        if(!email){
            return res.status(400).json({Emsgerr: 'email is required '})

        }

        if(!password){
            return res.status(400).json({Pmsgerr: 'password is required '})
        }
        const userExist = await User.findOne({email})

         if(userExist){
           return res.status(403).json({Emsgerr:'Already user with this email exist'})
         }

         if(password.length < 6){
           return res.status(403).json({Pmsgerr: 'password must to be greater than 6 characters of long'})
         }

        if(!email.includes('@')){
          return  res.status(400).json({Emsgerr: 'your email not valedate'})
        }else{
        const hashPassword = await bcrypt.hash(password, 10)
         const user = await User.create({email, password: hashPassword})
         await user.save()
         const token = createToken(user._id)
         res.cookie('jwt', token, {httpOnly: true, maxAge : maxAge * 1000 })
         
         return res.status(201).json({Rmsgsucc:'user create successful', newUser: user._id})

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msgerr:'Something went long'})
    }
}

module.exports.login_post = async(req, res) =>{

    const {email, password} = req.body
 
    try {
        
            if(!email){
                return res.status(400).json({Emsgerr: 'email is required '})
    
            }
    
            if(!password){
                return res.status(400).json({Pmsgerr: 'password is required '})
            }
            const user = await User.findOne({email})
    
             if(!user){
               return res.status(404).json({Emsgerr:'that email not registed , please try  other email'})
             }
             if(user){
                const isMatch = await bcrypt.compare(password, user.password)

                if(!isMatch){
                    return res.status(403).json({Pmsgerr:'incorrect Password , try other password'})
                }

             }
             // create toke 
             const token = createToken(user._id)
             res.cookie('jwt', token, {httpOnly: true, maxAge : maxAge * 1000 })

             return res.status(200).json({Lmsgsucc: 'Login successful', user:user._id})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({err:'Something went long'})
        
    }
}

module.exports.logout_get =  async(req, res)=>{
    res.cookie('jwt', '',{maxAge: 1})

    res.redirect('/')
}