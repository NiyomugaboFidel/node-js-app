 const jwt = require('jsonwebtoken');
 const {User} = require('../models/User')

const requireAuth = (req , res, next)=>{

    const token = req.cookies.jwt
    if(token){

        jwt.verify(token,'fidel secretkey', (err, decodedToken)=>{
            if(err){
                console.log(err)
                res.redirect('/login')

            }else{

                console.log(decodedToken)
                next()
            }
        })

    }else{
        res.redirect('/login')
    }

}

// check current user

  const checkUser = (req, res ,next)=>{

    const token = req.cookies.jwt
    
    if(token){

        jwt.verify(token,'fidel secretkey', async(err, decodedToken)=>{

            if(err){
               // console.log(err.message)
                
                res.locals.user = null

                next();
            }else{

                console.log(decodedToken.id)
                const user = await User.findById(decodedToken.id)
                    res.locals.user = user


                // if(decodedToken.id === undefined){

                //     res.localls.user = 'WelCome'
                    

                // }else{
                // }
                next();
            }
        })

    }else{

      res.locals.user = null  
      next();
    }

 }

 
 


module.exports = {requireAuth, checkUser}