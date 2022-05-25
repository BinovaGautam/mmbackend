const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');
var express = require('express');
let product = require('../config/product.js');

// for static file serve
const path = require("path");

let profile = require('../config/profile.js'); 
module.exports = function(app) {

	const controller = require('../controller/controller.js');
	const categoryController = require('../controller/categoryController.js');
	
	app.get('/api/userContent', [authJwt.verifyToken], controller.userContent);
	app.get('/api/adminContent', [authJwt.verifyToken], controller.adminContent);


	// Static file serve route
	app.use(express.static(path.join(__dirname, "../../../", "build")));
	app.use(express.static("public"));

	//Register
	app.post('/api/auth/signup', controller.signup);

	//Logged IN	
	app.post('/api/auth/signin', controller.signin);

  //Get Registered User Name && profile info
	app.get('/api/userview',[authJwt.verifyToken], controller.userview);	

	//Get Profile to be Saved in folder
	app.use('/profile', express.static(process.cwd() + '/profile'))
	
	//Get Products to be saved in folder <!---Vikas this is the folder in root to save the images-->
	app.use('/admin-products', express.static(process.cwd() + '/admin-products'))

 // Products to be pushed 
	app.post('/api/file/product', product.array("file"), controller.productss);

	// Profiles to be saved
	//app.post('/api/file/profile', profile.array("file"), controller.profile);
	
	//Destroy USER
	app.delete('/api/destroyUser/:id', [authJwt.verifyToken], controller.destroyUser);

	//Destroy Product
	app.delete('/api/destroyProduct/:id', [authJwt.verifyToken], controller.destroyProduct);
  //Product to be Posted in Homepage 
	app.post('/api/postproduct', controller.postproduct);

	//Get all the Userlist for Admin
	app.get('/api/userList',[authJwt.verifyToken],  controller.userList);

	//Get UserProfile to be updated
	app.put('/api/file/profileupdate', [authJwt.verifyToken], controller.updateProfile);
	

	//Get Product by its specified ID
	app.get('/api/productdetails/:id/',controller.productdetails);

	//Get Product 
	app.get('/api/advproductdetails/:id/',controller.advproductdetails);
 
 
	//Show Product list to the Admin
	app.get('/api/productList', [authJwt.verifyToken], controller.productList);

	//Show Edit product list to the Admin
	app.get('/api/editprod/:id', [authJwt.verifyToken], controller.editprod);
	
	//Add to my cart
	app.post('/api/addtocart', [authJwt.verifyToken], controller.addtoCart);

	app.post('/api/order', [authJwt.verifyToken], controller.order);

    //Details to Cart
	app.post('/api/addproductdetails', [authJwt.verifyToken], controller.addproductdetails);


	app.get('/api/orderCount', [authJwt.verifyToken], controller.orderCount);

	//Forget Password to be reset
	app.put('/api/UpdateNewPassword',  controller.UpdateNewPassword);
	

	//Buying Packages after finalized the Category
	app.post('api/BuyPackage',controller.BuyPackage)

	//Destroy Registered User (For Admin Comfort)
	app.delete('/api/destroyUser/:id', [authJwt.verifyToken], controller.destroyUser);

 //Map Products Posted by Admin
	app.get('/api/get/MapAdminProduct',  controller.adminpostedproduct);
	
  //Map Products Posted by User
  app.get('/api/get/MapUserProduct',  controller.userpostedproduct);
 
	//Get product to be viewed in HomePage 
	app.get('/api/dashproductList', controller.dashproductList);

  //Posting Advertisement by User
	app.post('/api/postadvertisement', controller.postadvertisement);
	
	//Getting Advertisement by User
	app.get('/api/get/postadvertisement', controller.Getpostadvertisement);

	//Categories Section
	// Post Category by User
	app.post('/api/categories', [authJwt.verifyToken],categoryController.createCategory);

	// Get All Category by User
	app.get('/api/categories', categoryController.getCategories);
	
	// Get Single Category by User
	app.get('/api/categories/:id', categoryController.getCategory);
	
	// Update Category by User
	app.put('/api/categories/:id', [authJwt.verifyToken], categoryController.updateCategory);
	
	// Delete Category by User
	app.delete('/api/categories/:id', [authJwt.verifyToken], categoryController.deleteCategory);
}
  