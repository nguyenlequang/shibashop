import bcrypt from 'bcryptjs'
const data={
    users:[
        {
            name:'lee',
            email:'lee@gmail.com',
            password:bcrypt.hashSync('1234',8),
            isAdmin:true,
        },
        {
            name:'quang',
            email:'quang@gmail.com',
            password:bcrypt.hashSync('1234',8),
            isAdmin:false,
        }
    ],
    products:[
        {
          
            name:'Nike Slim Shirt',
            category:'Shirts',
            image:'/images/p1.jpg',
            price:120,
            countInStock:10,
            brand:'Nike',
            rating:4.5,
            numReviews:10,
            description:'high quality product',
        },
        {
           
            name:'Adidas Fit Shirt',
            category:'Shirts',
            image:'/images/p2.jpg',
            price:120,
            countInStock:20,
            brand:'Adidas',
            rating:4.0,
            numReviews:10,
            description:'high quality product',
        },
        {
            
            name:'Lacoste Free Shirt',
            category:'Shirts',
            image:'/images/p3.jpg',
            price:220,
            countInStock:0,
            brand:'Lacoste',
            rating:4.8,
            numReviews:17,
            description:'high quality product',
        },
        {
            
            name:'Nike Slim Pant',
            category:'Pants',
            image:'/images/p4.jpg',
            price:78,
            countInStock:15,
            brand:'Nike',
            rating:4.5,
            numReviews:14,
            description:'high quality product',
        },
        {
           
            name:'Puma Slim Shirt',
            category:'Shirts',
            image:'/images/p5.jpg',
            price:65,
            countInStock:5,
            brand:'Puma',
            rating:4.5,
            numReviews:10,
            description:'high quality product',
        },
        {
           
            name:'Adidas Fit Pant',
            category:'Pants',
            image:'/images/p6.jpg',
            countInStock:12,
            price:139,
            brand:'Adidas',
            rating:4.5,
            numReviews:15,
            description:'high quality product',
        },
     
    ]
}

export default data