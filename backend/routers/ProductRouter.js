import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import data from '../data.js'
import Product from '../models/ProductModel.js'
import {isAuth,isAdmin,isSeller,isSellerOrAdmin} from '../utils.js'

const productRouter=express.Router()


productRouter.get('/',expressAsyncHandler(async(req,res)=>{
    const name=req.query.name||''
    const category=req.query.category||''
    const nameFilter=name?{name:{$regex:name,$options:'i'}}:{}
    const order = req.query.order || '';
    const min =req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0
    // const products =await Product.find({})
    const seller=req.query.seller||''
    const sellerFilter=seller?{seller}:{}
    const categoryFilter = category ? { category } : {}
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
        order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };

    // const products=await Product.find({...sellerFilter}).populate('seller','seller.name seller.logo')
    const products=await Product.find({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    }).populate('seller','seller.name seller.logo').sort(sortOrder)
    res.send(products)
}))

productRouter.get('/seed',expressAsyncHandler(async (req,res)=>{
    const createdProduct=await Product.insertMany(data.products)
    res.send({createdProduct})

}))

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category")
    res.send(categories)
  })
)

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller','seller.name seller.logo seller.rating seller.numReviews')
    if (product) res.send(product)
    else res.status(400).send({ message: "not found" })
  })
)
// chi co admin hoac seller moi co quyen dang san pham len ban
productRouter.post('/',isAuth,isSellerOrAdmin,expressAsyncHandler(async(req,res)=>{
    // neu da ton tai thi se xu ly bang catch trong expressAsyncHanfler
    const {name,image,price,category,brand,countInStock,rating,numReviews,description}=req.body
    const seller=req.user._id 
    const product = new Product({
      name,
      image,
      price,
      category,
      brand,
      countInStock,
      rating,
      numReviews,
      description,
      seller, // cho biet product nay la cua seller nao
    })
    const createdProduct=await product.save()
    res.send({message:'Product created',product:createdProduct})
}))
// lay tat ca product

// C:create

// U :update
// chi có selller hoặc admin mới có quyền update sản phẩm
productRouter.put('/:id',isAuth,isSellerOrAdmin,expressAsyncHandler(async(req,res)=>{
    const productId=req.params.id // id day la path cua :id --> luu y rang paramter khac voi query
    const product=await Product.findById(productId)
    if(product){
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        
        const updatedProduct=await product.save()
        //trả về cho client product đã được update qua dạng json
        return res.status(200).send({message:'updated successfully',product:updatedProduct})
    }
    else
    {
        return res.status(404).send({message:'Product not found ditmem '})
    }
}))

productRouter.delete('/:id',isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id)
    if(product){
        const deletedProduct=await product.remove()
        return res.status(200).send({message:'Product deleted',product:deletedProduct})
    }
    else{
        return res.status(400).send({message:'Product Not Found cc'})
    }
}))

productRouter.post('/:id/reviews',isAuth,expressAsyncHandler(async(req,res)=>{
    const productId=req.params.id
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length
        
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }

}))


export default productRouter