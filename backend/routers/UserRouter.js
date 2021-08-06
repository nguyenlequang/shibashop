import express from 'express'
import User from '../models/UserModel.js'
import data from '../data.js'
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import {generateToken,isAuth,isAdmin} from '../utils.js'

const userRouter=express.Router()




userRouter.get('/',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
        const users=await User.find({})
        res.send({message:"success",users})
}))

// userRouter.get('/seed',expressAsyncHandler( async(req,res)=>{
//   const createdUsers = await User.insertMany(data.users)
//   res.send({ createdUsers })
// }
// ))

userRouter.get('/top-sellers',expressAsyncHandler(async(req,res)=>{
        const topSellers=await User.find({isSeller:true}).sort({'seller.rating':-1}).limit(3)
        return res.status(200).send(topSellers)
}))

userRouter.post('/signin',expressAsyncHandler(async(req,res)=>{
        const user=await User.findOne({email:req.body.email})
        
        if(user){
                const {_id,name,email,isAdmin,isSeller}=user
                if(bcrypt.compareSync(req.body.password,user.password)){
                        // send json ve phia client
                        return  res.send({
                                _id,
                                name,
                                email,
                                isAdmin,
                                isSeller,
                                token:generateToken(user),
                        
                        })
                       
                }
        }
        return res.status(401).send({message:'Invalid email or password'})
}))

userRouter.post('/register',expressAsyncHandler(async(req,res)=>{
       
        
        const user = new User({
          name:req.body.name,
          email:req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
        })

        const createdUser=await user.save()
        
        res.send({
                _id:createdUser._id,
                name:createdUser.name,
                email:createdUser.email,
                isAdmin:createdUser.isAdmin,
                isSeller:user.isSeller,
                token:generateToken(createdUser),
        })
}))

userRouter.get('/:id',expressAsyncHandler(async(req,res)=>{
        const user=await User.findById(req.params.id)
        if(user){
                res.send(user)
        }
        else{
                res.status(404).send({ message: "user not found" })
        }
}))

userRouter.delete('/:id',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
        const user=await User.findById(req.params.id)
        if(user){
          if (user.isAdmin === false) {
            const deletedUser = await user.remove()
            return res
              .status(200)
              .send({ message: "delete successfully", user: deletedUser })
          } else {
            return res.status(400).send({ message: "you can not delete Admin" })
          }
        }
        else
        {
                return res.status(404).send({message:'user not found'})
        }
}))

userRouter.put('/profile',isAuth,expressAsyncHandler(async(req,res)=>{
        const user=await User.findById(req.user._id)
        if(user){
                user.name=req.body.name||user.name
                user.email=req.body.email||user.email
                if (user.isSeller) {
                  user.seller.name = req.body.sellerName || user.seller.name
                  user.seller.logo = req.body.sellerLogo || user.seller.logo
                  user.seller.description =
                    req.body.sellerDescription || user.seller.description
                }
                if(req.body.password){
                        user.password =bcrypt.hashSync(req.body.password,8)
                }
                const updatedUser=await user.save()
                res.send({
                  _id: updatedUser._id,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  isAdmin: updatedUser.isAdmin,
                  isSeller:user.isSeller,
                  token: generateToken(updatedUser),
                })
        }
}))
userRouter.put('/:id',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
        const user=await User.findById(req.params.id)
        if(user){
                user.name = req.body.name || user.name
                user.email = req.body.email || user.email
                user.isSeller = req.body.isSeller || user.isSeller
                user.isAdmin = req.body.isAdmin || user.isAdmin
                const updatedUser = await user.save()
                res.status(200).send({message:'updated',user:updatedUser})

        }else{
                return res.status(404).send({message:'user not found'})
        }
}))

export default userRouter