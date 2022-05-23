const db = require('../config/db.config.js');
const config = require('../config/config.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mime = require('mime');
const fs = require('fs');
const { category, postadd } = require('../config/db.config.js');
const { body } = require('express-validator');


//Declaring Databases
const Register = db.register;

const Role = db.role;
const Op = db.Sequelize.Op;
const Product = db.product;
const AddtoCart = db.addtocart;
const Package = db.package;
const PostAdd = db.postadd;





exports.userContent = (req, res) => {
	Register.findOne({
		where: { id: req.userId },
		attributes: ['fullname', 'number',],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(Register => {
		res.status(200).json({
			"description": "User Content Page",
			"user": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

exports.adminContent = (req, res) => {
	Register.findOne({
		where: { id: req.userId },
		attributes: ['id', 'fullname','number'],
		include: [{
			model: Role,
			attributes: ['name'],

		}]
	}).then(Register => {
		res.status(200).json({
			"description": "Admin Content Page",
			"user": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}



///////////REGISTER
exports.signup = (req,res) => {
	console.log("Sign-Up >>>>>>>" , req.body);
Register.findOne({ where : {
	number:req.body.number} 
}).then(register => {
	if (register) {
		return res.status(400).send('This number has already been registered');
	}
	  else{
		Register.create({
			fullname: req.body.fullname,
		number:req.body.number
		}).then(Register => {
			Role.findAll({
				where: {
					name:{
						[Op.or]: req.body.roles
					}
				}
			}).then(roles => {
				Register.setRoles(roles).then(()=> {
           res.status(200).json({
						"description": "signup successfully..!",
						"Register": Register
					 })
				});
			}).catch(err => {
				res.status(500).send("Error -> " + err);
			})
		})
	}
})




}


	


//Login
exports.signin = (req, res) => {
	console.log("Sign-In");

	Register.findOne({
		where: {
			number: req.body.number
		}
	}).then(Register => {
		if (!Register) {
			return res.status(404).send('User Not Found.');
		}

		//var passwordIsValid = bcrypt.compareSync(req.body.password, Register.password);
		// if (!passwordIsValid) {
		// 	return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		// }

		var token = jwt.sign({ id: Register.id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});

		res.status(200).send({ auth: true, accessToken: token });

	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});



}

exports.destroyProduct = (req, res) => {
	var id = req.params.id;
	Product.destroy({
		where: { id: id },
	}).then(register => {
		res.status(200).json({
			"register": register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Coudn't Delete the Product it...!",
			"error": err
		});
	})
}

exports.destroyUser = (req, res) => {
	var id = req.params.id;
	Register.destroy({
		where: { id: id },
	}).then(user => {
		res.status(200).json({
			"register": register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Coudn't Delete the User it...!",
			"error": err
		});
	})
}
	
	

// //Admin Post Product 
// exports.postproduct = (req, res) => {
// 	// Save User to Database
// 	console.log("Processing func -> Adding Products");
// 	let imgbase = req.body.imgbase;
// 	let filename = "admin-products/" + Date.now().toString() + ".png";
// 	if (imgbase) {
// 		let arr = imgbase.split(',');
// 		//let arrtemp = arr[0].split('/');
// 		fs.writeFile(filename, arr[1], 'base64', function (err) {
// 			if (err) { 

// 			}
// 			else {

// 			}
// 		})
// 	}
// 	Product.create({
// 		name: req.body.name,
// 		desc: req.body.desc,
// 		category: req.body.category,
// 		price: req.body.price,
// 		city: req.body.city,
//     imgbase: filename,
// 		quant: req.body.quant,
// 		productphone: req.body.productphone,
// 		productfullname: req.body.productfullname,
// 		location: req.body.location,
// 		userId: req.body.userId
	
// 	}).then(product => {

// 		res.status(200).json({
// 			"description": "Admin Posted Product Successfully..!",
// 			"product": product
// 		});
// 	}).catch(err => {
// 		res.status(500).json({
// 			"description": "Admin Failed to Post Product..!",
// 			"error": err
// 		});
// 	})
// }




//Admin Post Product 
exports.postproduct = (req, res) => {
	// Save User to Database
	console.log(req.body.filename);
  let filenameTemp = req.body.filename;
	console.log("Processing func -> Adding Products");
	let imgbase = req.body.imgbase;
	let count = req.body.count
	let filename = filenameTemp;
	if (filename) {
		let arr = filename.split(',');
		//let arrtemp = arr[0].split('/');
console.log(arr[count]);
		fs.writeFile(arr[count],req.body.
			imgbase.split(',')[1], 'base64', function (err) {
			if (err) {
}else {
}
		})
	}
if(parseInt(count) == 0)
{
	Product.create({
		name: req.body.name,
		desc: req.body.desc,
		category: req.body.category,
		price: req.body.price,
		city: req.body.city,
		imgbase: filenameTemp,
		quant: req.body.quant,
		productphone: req.body.productphone,
		productfullname: req.body.productfullname,
		location: req.body.location,
		userId: req.body.userId
	
	}).then(product => {
   res.status(200).json({
			"description": "Admin Posted Product Successfully..!",
			"product": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Admin Failed to Post Product..!",
			"error": err
		});
	})
}else
{
res.status(200).json({
			"description": "Admin Posted Product Successfully..!",
			//"product": product
		});
}

}


//USER ADVERTISEMENT
exports.postadvertisement = (req, res) => {

	console.log(req.body.filename);
	let filenameTemp = req.body.filename;
	console.log("Processing func -> Adding Products");
	let advimgbase = req.body.advimgbase;
	let count = req.body.count
	let filename = filenameTemp;
	if (filename) {
		let arr = filename.split(',');
		//let arrtemp = arr[0].split('/');
console.log(arr[count]);
		fs.writeFile(arr[count],req.body.
			advimgbase.split(',')[1], 'base64', function (err) {
			if (err) {
}else {
}
		})
	}
if(parseInt(count) == 0)
{
	PostAdd.create({
		advcountry:req.body.advcountry,
		advname: req.body.advname,
		advprice: req.body.advprice,
		advquant: req.body.advquant,
		advdesc: req.body.advdesc,
		advcategory:req.body.advcategory,
		advcity: req.body.advcity,
		advphone: req.body.advphone,
		advfullname: req.body.advfullname,
		advimgbase: filenameTemp,
		advlocation:req.body.advlocation,
		category:req.body.category,
		userId: req.body.userId,

   }).then(postadd => {
		res.status(200).json({
     "description": "User Posted Product Successfully..!",
			"postadd": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "User Failed to Post Product..!",
			"error": err
		});
	})
} else{
	res.status(200).json({
		"description": "User Posted Product Successfully..!",
		"postadd": postadd
	});
}
}




//EDit Profile
exports.updateProfile = (req, res) => {
	// Save User to Database
	console.log("Processing func -> Adding Products");
	let profilephoto = req.body.profilephoto;
	let filename = "profile/"+req.body.userId + ".png";
	console.log(filename)
	if (profilephoto) {
		let arr = profilephoto.split(',');
		console.log(arr[1]);
		console.log(filename);
		//let arrtemp = arr[0].split('/');
		fs.writeFile(filename, arr[1], 'base64', function (err) {
			if (err) {
}
			else {

			}
		})
	}
	Register.update(
		{

			fullname: req.body.fullname,
			number: req.body.number,
			profilephoto: filename
		},
		{ where: { id: req.userId } }
	).then(Register => {
		res.status(200).json({
			"description": Register

		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})

}



//Get UserList

exports.userList = (req, res) => {
	Register.findAll({
		attributes: ['id', 'fullname', 'number'],
		// include: [{
		// 	model: Role,
		// 	attributes: ['id', 'name'],
		// 	through: {
		// 		attributes: ['registerId', 'roleId'],
		// 	}
		// }]
	}).then(Register => {
		res.status(200).json({
			//"description": "Admin Board",
			"Register": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



//Get Name of User in sidebar
exports.userview = (req, res) => {
	Register.findOne({
		where: { id: req.userId },
		attributes: ['id', 'fullname', 'number','profilephoto'],
		include: [{
			model: Role,
			attributes: ['name'],

		}]
	}).then(Register => {
		res.status(200).json({
			"description": "User Content Page",
			"Register": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

//Fetch and display in dashboard
exports.adminpostedproduct = (req, res) => {
	Product.findAll({
		attributes: ['id', 'name', 'price', 'location', 'productphone', 'productfullname','id',
			'desc', 'city', 'category', 'quant', 'imgbase', 'userId'],
	}).then(product => {
		res.status(200).json({
			"product": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Seems some error please check...!",
			"error": err
		});
	})
}

exports.userpostedproduct = (req, res) => {
	PostAdd.findAll({
		attributes: ['id', 'advname', 'advprice', 'advquant', 'advdesc', 'advphone', 'advlocation',
			'advcity', 'advfullname', 'advimgbase',  'userId'],
	}).then(postadd => {
		res.status(200).json({
			"postadd": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Seems some error with User Mapping please check...!",
			"error": err
		});
	})
}



//Get product Details

exports.productdetails = (req, res) => {
	var id = req.params.id;
	PostAdd.findOne({
		where: { id: id },
		attributes: ['id', 'advname', 'advquant',
		'advphone','advlocation','advimgbase',
		'advcity', 'advprice', 'advdesc','advquant',
		   'userId']

	}).then(postadd => {
		res.status(200).json({
			"Register": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})
}
exports.advproductdetails = (req,res) => {
	var id = req.params.id;
	PostAdd.findOne({
		where: { id: id },
		attributes: ['id', 'advname', 'advquant',
		'advphone','location','advimgbase',
		'advcity', 'advprice', 'advdesc',
		   'userId']

	}).then(postadd => {
		res.status(200).json({
			"Register": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})	
}

//Product Pushing Saving Array
exports.productss = (req, res) => {
	res.status(200).json({
		"description": "Product saved into Folder",


	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Product Page",
			"error": err
		});
	})
}









exports.productList = (req, res) => {
	Product.findAll({

		attributes: ['name', 'price', 'quant', 'city',
		'desc','productphone','productfullname','id',
		 'category', 'city', 'userId'],
	}).then(product => {
		res.status(200).json({
			//"description": "Admin Board",
			product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



exports.orderCount = (req, res) => {
	Order.count({
	}).then(order => {
		res.status(200).json({
			order
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



exports.order = (req, res) => {
	// Save User to Database
	// console.log(req);

	Order.create({
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		quantity: req.body.quantity,
		userId: req.body.userId,
		total: req.body.total,
		productId: req.body.productId,

	}).then(order => {
		res.status(200).json({
			"description": "order Added",
			"order": order
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access addtocart Page",
			"error": err
		});
	})
}

exports.addproductdetails = (req, file, res) => {

	var type = upload.single('image');
	console.log("req.body is ");
	console.log(req.body);
	var tmp_path = req.file.path;

	/** The original name of the uploaded file
		stored in the variable "originalname". **/
	var target_path = 'uploads/' + req.file.originalname;

	/** A better way to copy the uploaded file. **/
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	src.on('end', function () { res.render('complete' + target_path); });
	src.on('error', function (err) { res.render('error'); });

}


exports.addtoCart = (req, res) => {
	// Save User to Database
	console.log("Processing func -> Adding Products");
	AddtoCart.create({
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		quantity: req.body.quantity,
		userId: req.body.userId,
		total: req.body.total,
		productId: req.body.productId,

	}).then(addtocart => {
		res.status(200).json({
			"description": "addtocart Added",
			"addtocart": addtocart
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access addtocart Page",
			"error": err
		});
	})
}



exports.editprod = (req, res) => {
	var id = req.params.id;
	Product.findOne({
		where: { id: id },
		attributes: ['id', 'name', 'price', 'quant', 'desc', 'category', 'city', 'image', 'userId'],
	}).then(product => {
		res.status(200).json({
			"user": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}




exports.BuyPackage = (req, res) => {
	console.log("Processing func -> Packages");
	Package.create({
		packageprice: req.body.packageprice,
		packagetotal: req.body.packagetotal,
		packageId: req.body.packageId,
		userId: req.body.userId
	}).then(package => {
		res.status(200).json({
			package
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can nt access Package",
			"error": err
		});
	})
}

//Update My New Password?

exports.UpdateNewPassword = (req, res) => {
	Register.findOne({
		where: {
			fullname: req.body.fullname,
		}
	}).then(register => {
		if (!register) {
			return res.status(404).send('User Not Found or not approved.');
		}


		Register.update(
			{
				number: bcrypt.hashSync(req.body.number),

			},
			{ where: { number: req.body.number } }
		).then(Register => {
			res.status(200).json({
				"description": "user",
				"Updated": Register

			});
		}).catch(err => {
			res.status(500).json({
				"description": "Can not access Management Board",
				"error": err
			});
		})
	})
}


//Destroy
exports.destroyUser = (req, res) => {
	var id = req.params.id;
	Register.destroy({
		where: { id: id },
	}).then(Register => {
		res.status(200).json({
			"Register": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Failed to delete...!",
			"error": err
		});
	})
}

//Get Products details from Admin AddPro
exports.dashproductList = (req, res) => {
	Product.findAll({

		attributes: ['id', 'name', 'price', 'location', 'productphone', 'productfullname',
			'desc', 'city', 'category', 'quant', 'imgbase', 'userId'],
	}).then(product => {
		res.status(200).json({
			//"description": "Admin Board",
			product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}






exports.Getpostadvertisement = (req, res) => {
	PostAdd.findAll({
   attributes: ['id', 'advname', 'advprice', 'advimgbase', 'advquant', 'advdesc',
		'advcity','advphone','advlocation','advfullname','userId'],
	}).then(postadd => {
		res.status(200).json({
			"description": "Got Your Products User...!",
			postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": " Can't Got Your Products User...!",
			"error": err
		});
	})

}




