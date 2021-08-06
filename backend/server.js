import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/UserRouter.js'
import productRouter from './routers/ProductRouter.js'
import orderRouter from './routers/OrderRouter.js'
import path from 'path'
import uploadRouter from './routers/UploadRouter.js'


dotenv.config()
const app=express()
app.use(cors())
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@amazona.cafw3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    console.log("connected mongoDB")
  } catch (err) {
    console.log('I am Lee')
    console.log(err)
  }
} 
connectDB()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(cors())
app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
})
app.get('/',(req,res)=>{
    res.send('server is ready')
})

// app.get('/api/products',(req,res)=>{
//     res.send(data.products)
// })
app.use('/api/uploads',uploadRouter)
app.use('/api/products',productRouter)
app.use('/api/users',userRouter)  
app.use('/api/orders',orderRouter)
app.get('/api/config/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID||'sb')
})

const __dirname=path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))
const port=process.env.PORT||5000

app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}`)
})