import jwt from 'jsonwebtoken'
export const generateToken=user=>{
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller:user.isSeller
      },
      process.env.JWT_SECRET || "somethingsecretlee",
      {
        expiresIn: "30d", // gioi han trong 30 ngay
      }
    )
}

// chi can la seller
export const isSeller=(req,res,next)=>{
  if(req.user&&req.user.isSeller){
    next()
  }else{
    return res.status(401).send({message:'Invalid seller token'})
  }
}

export const isSellerOrAdmin=(req,res,next)=>{  // seller hoac admin moi co the thuc hien dc chuc nanng (vi admin khong la seller)
  if(req.user&&(req.user.isSeller||req.user.isAdmin)){
    next()
  }else{
    return res.status(404).send({message:'not seller or admin token'})
  }
}

export const isAuth=(req,res,next)=>{
  const authorization = req.headers.authorization
  if (authorization) {
    const token = authorization.slice(7, authorization.length) // lay token sau Bearer cua "Bearer xxxxxxxx"
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecretlee",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" })
        }
        else{
          req.user=decode
          next()  // middleware sau khi qua duoc thi se den ham tiep theo
        }
      }
    )
  }
  else{
    res.status(401).send({ message: "No Token" })
  }
  
}

export const isAdmin=(req,res,next)=>{
  if(req.user&&req.user.isAdmin){
    next()
  }
  else{
    return res.status(401).send({message:'Invalid Admin Token'})
  }
}