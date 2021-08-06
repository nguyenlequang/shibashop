import mongoose from 'mongoose'

const Schema=mongoose.Schema

const reviewSchema=new Schema({
  name:{type:String,required:true},
  comment:{type:String,required:true},
  rating:{type:Number,required:true}
},{
  timestamps:true
})

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true,default:0 },
    numReviews: { type: Number, required: true,default:0 },
    description:{type:String,required:true},
    seller:{type:Schema.Types.ObjectId,ref:'User'} ,// san pham nay thuoc seller nao
    reviews:[reviewSchema]
  },
  { timestamps: true }
)

const Product=mongoose.model('Product',ProductSchema)

export default Product