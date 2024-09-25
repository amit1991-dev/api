const express = require("express");
const Products = require("../node_models/products.js");
const Orders = require("../node_models/orders.js");
const Cart = require("../node_models/cart.js");
const Transactions = require("../node_models/transactions.js");

const router = express.Router(); // route : {root}/shopping/
// const passport = require("passport");

//METHODS:
// 0.ADMIN: add a product, disable product, remove product, edit product, add image, remove image, add
// 1.list Products;  11. Search Products
// 2. GET a Product; 12: add reviews
// 3. Add to Cart
// 4. view Cart
// 5. remove item from Cart
// 6. cart: edit quantity
// 7. proceed to pay
// 8. Payment success: create order n empty cart
// 9. View orders
// 10. cancel order: initiate refund!

//ADMIN functions


router.get("/", (req, res, next) => {
    var filter=req.body.filter==null?null:req.body.filter;
    console.log(filter);
    Products.listing(filter=filter).then(function(data){
        var ret= {status:"success",data:data};
        res.status(200).json(ret);
    }).catch(function(err){
        var ret= {status:"failed",data:err};
        res.status(200).json(ret);
    });
});


router.get("/product/:product_id", (req, res, next) => {
    Products.getProduct(req.params.product_id).then(function(data){
        var ret= {status:"success",data:data};
        res.status(200).json(ret);
    }).catch(function(err){
        var ret= {status:"failed",data:err};
        res.status(200).json(ret);
    });
});

//ok working
router.post("/prod_edit/:product_id", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
    if(req.user && req.user.role=="admin")
    {
        Products.updateProductInfo(req.params.product_id,req.body.data).then(function(data){
            var ret= {status:"success",data:data,message:"done"};
            res.status(200).json(ret);
        }).catch(function(err){
            var ret= {status:"failed",data:err,message:"some error occured"};
            res.status(200).json(ret);
        });
    }
    else{
        res.status(200).json(ret);
    }
    
});

//ok
router.post("/prod_create/", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
    if(req.user && req.user.role=="admin")
    {
        new Products({name:req.body.name,price:req.body.price}).save(function(err,data){
            if (err){
                console.log(err);
                ret.message="some error occured";
                res.status(200).json(ret);
            }
            else{
                var ret= {status:"success",data:data,message:"done"};
                res.status(200).json(ret);
            }
        });
    }
    else{
        res.status(200).json(ret);
    }
    
});


//ok working
router.post("/prod_ins_rev/:product_id", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
   
        Products.insertReview(req.params.product_id,JSON.parse(req.body.review)).then(function(data){
            var ret= {status:"success",data:data,message:"done"};
            res.status(200).json(ret);
        }).catch(function(err){
            var ret= {status:"failed",data:err,message:"some error occured"};
            res.status(200).json(ret);
        });
    
    
});

//ok working
router.post("/prod_del_img/:product_id", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
    // if(req.user && req.user.role=="admin")
    // {
        Products.removeImage(req.params.product_id,req.body.image_url).then(function(data){
            var ret= {status:"success",data:data,message:"done"};
            res.status(200).json(ret);
        }).catch(function(err){
            var ret= {status:"failed",data:err,message:"some error occured"};
            res.status(200).json(ret);
        });
    // }
    // else{
    //     res.status(200).json(ret);
    // }
    
});


/////cart
router.get("/cart/:user_id", (req, res, next) => {
    Cart.getCart(req.params.user_id).then(function(data){
        var ret= {status:"success",data:data};
        res.status(200).json(ret);
    }).catch(function(err){
        var ret= {status:"failed",data:err};
        res.status(200).json(ret);
    });
});


//ok working
router.post("/cart_ins_item/", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
   
// Cart.insertItemIntoCart(req.user.id,JSON.parse(req.body.item)).then(function(data){
    Cart.insertItemIntoCart(req.user.id,req.body.item).then(function(data){
        if(data)
        {
            var ret= {status:"success",message:"done"};
            res.status(200).json(ret);
        }
        else{
            var ret= {status:"failed",message:"some error occured"};
            res.status(200).json(ret);
        }
        
    }).catch(function(err){
        var ret= {status:"failed",message:"some error occured"};
        res.status(200).json(ret);
    });
});


//ok working create cart function
// router.post("/cart_user_create/", (req, res, next) => {
//     var ret= {status:"failed",message:"not admin"};  
//     new Cart({user_id:req.user.id}).save().then(function(){
//     // new Cart({user_id:"60918652f0dea91fce297eed",items:[]}).save(function(err,data){
//         var ret= {status:"failed",message:""};
//         if(err)
//         {
//             console.log(err);
//             ret.message="not being saved";
//             res.json(ret);
//             return;
//         }
//         console.log(data);//{ items: [],_id: 60970aa5848b0b4324de81f0,user_id: 60918652f0dea91fce297dbd,__v: 0 }
//         ret.status="success";
//         ret.message="done";
//         res.status(200).json(ret);
//     });
// });


//ok working
router.post("/cart_del_item/", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
// Cart.insertItemIntoCart(req.user.id,JSON.parse(req.body.item)).then(function(data){
    Cart.removeElementFromCart(req.user.id,req.body.product_id).then(function(data){
        console.log(data);
        if(data)
        {
            var ret= {status:"success",message:"done"};
            res.status(200).json(ret);
        }
        else{
            var ret= {status:"failed",message:"some error occured"};
            res.status(200).json(ret);
        }
        
    }).catch(function(err){
        console.log(err);
        var ret= {status:"failed",message:"some error occured"};
        res.status(200).json(ret);
    });
});


//ok working
router.post("/cart_mod_qty/", (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
// Cart.insertItemIntoCart(req.user.id,JSON.parse(req.body.item)).then(function(data){
    Cart.modifyCartItemQuantity(req.user.id,req.body.product_id,req.body.quantity).then(function(data){
        console.log(data);
        if(data)
        {
            var ret= {status:"success",message:"done"};
            res.status(200).json(ret);
        }
        else{
            var ret= {status:"failed",message:"some error occured"};
            res.status(200).json(ret);
        }
        
    }).catch(function(err){
        console.log(err);
        var ret= {status:"failed",message:"some error occured"};
        res.status(200).json(ret);
    });
});


//ok working
router.post("/cart_clr/",(req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
// Cart.insertItemIntoCart(req.user.id,JSON.parse(req.body.item)).then(function(data){
    Cart.clearCart(req.user.id).then(function(data){
        console.log(data);
        if(data)
        {
            var ret= {status:"success",message:"done"};
            res.status(200).json(ret);
        }
        else{
            var ret= {status:"failed",message:"some error occured"};
            res.status(200).json(ret);
        }
        
    }).catch(function(err){
        console.log(err);
        var ret= {status:"failed",message:"some error occured"};
        res.status(200).json(ret);
    });
});




//Orders
//get
router.post("/orders", async (req, res, next) => {
	var ret= {status:"success",message:"order id is not valid"};
	var user_id = req.user.id;
	var orders = await Orders.getUserOrders(user_id);
	if(orders)
	{
		ret.data=orders;
		ret.status = "success";
	}
	res.status(200).json(ret);
});

//cancel
router.post("order/cancel/:order_id", async (req, res, next) => {
	var ret= {status:"failed",message:"order has not been cancelled"};

	if(!req.params.order_id)
	{
		res.status(200).json(ret);
		return;
	}

	var cancellation_object = {};
	cancellation_object.reason = req.body.reason;
	cancellation_object.action = "cancellation";
	cancellation_object.cancelled=true;

	if(await Orders.cancelOrder(req.params.order_id,cancellation_object))
	{
		ret.status="success";
		ret.message = "order cancelled successfully";
		
	}
	res.status(200).json(ret);

});



//Transactions
//to be tested
router.post("/transaction/create", async (req, res, next) => {
    var ret= {status:"failed",message:"not admin"};
    var cartObj = await Cart.getTotalAmount(req.user.id);

    if(cartObj && cartObj.status=="success")
    {
        //means everything is in order to make the order complete
        new Transactions({amount:Math.ceil(cartObj.totalAmount*cartObj.discount/100),user_id:req.user.id}).save(function(err,data){
            if (err){
                console.log(err);
                ret.message="some error occured";
                res.status(200).json(ret);
            }
            else{
                data.cart_obj=cartObj;
                var ret= {status:"success",data:data,message:"Can proceed with the transaction, Server Ready!"};
                res.status(200).json(ret);
            }
        });
    }
    else{
        var ret= {status:"failed",data:cartObj,message:"Some Items are out of stack, list in the body"};
                res.status(200).json(ret);
    }
   
    
});

module.exports = router;
