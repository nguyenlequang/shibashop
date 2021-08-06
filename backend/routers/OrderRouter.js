import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/OrderModel.js'
import { isAuth,isAdmin,isSeller,isSellerOrAdmin } from '../utils.js'
const orderRouter=express.Router()

// chi co seler hoac admin moi co quyen xem order
orderRouter.get('/',isAuth,isSellerOrAdmin,expressAsyncHandler(async(req,res)=>{
  // const orders = await Order.find({}).populate("user", "name") // lay ra user va name trong collection
  const seller=req.query.seller||''  // luc nay nhan vao seller la dang String --> truy xuat ra tu trong query để lấy ra đúng sản phẩm của hãng nào
  const sellerFilter=seller?{seller}:{} // lay nay sellerFilter la 1 obj={seller:seller}
  const orders=await Order.find({...sellerFilter}).populate('user','name') // chỉ lấy ra tên người mua và tên sản phẩm
  return res.status(200).send(orders)
}))

orderRouter.get('/mine',isAuth,expressAsyncHandler(async(req,res)=>{
  const orders=await Order.find({user:req.user._id})
  res.send(orders)
}))


// chi can la user thì có thể tự tạo ra 1 đơn hàng
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      return res.status(400).send({ message: "Cart is empty" })
    } else {
      const seller=req.body.orderItems[0].seller // ai la nguoi ban san phan nay
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      } = req.body
      const order = new Order({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
        seller,
      })
      const createdOrder = await order.save()
      return res
        .status(201)
        .send({ message: "New One Created", order: createdOrder })
    }
  })
)

orderRouter.get('/:id',isAuth,expressAsyncHandler(async(req,res)=>{
  const order=await Order.findById(req.params.id)
  if(order){
    return res.send(order)
  }
  else{
    res.status(400).send({ message: "Order not found" })
  }
}))

orderRouter.delete('/:id',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
  const order=await Order.findById(req.params.id)
  if (order) {
    const deletedOrder = await order.remove()
    return res
      .status(200)
      .send({ message: "delete successfully", order: deletedOrder })
  } else {
    return res.status(400).send({ message: "Order not found" })
  }
}))

orderRouter.put('/:id/pay',isAuth,expressAsyncHandler(async(req,res)=>{
  const order=await Order.findById(req.params.id)
  if(order){
    order.isPaid=true
    order.paidAt=Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }

    const updatedOrder=await order.save()
    res.send({message:'Order paid',order:updatedOrder})
  }
  else{
    res.status(400).send({message:'Order not found'})
  }
}))

orderRouter.put('/:id/deliver',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
  const order=await Order.findById(req.params.id)
  if(order){
    order.isDelivered=true
    order.deliveredAt=Date.now()

    const updatedOrder=await order.save()
    return res.status(200).send({message:'order devlivered',order:updatedOrder})

  }
  else{
    return res.status(404).send({message:'Order not found'})
  }
}))

export default orderRouter