var express = require('express');
var app = express();
cors = require('cors');
var formidable = require('formidable');
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10000mb', extended: true}))
// parse application/json
app.use(bodyParser.json({limit: '10000mb', extended: true}))
app.use('/user-products', express.static(__dirname + '/user-products'));


	
app.use(cors({ origin: true }));
global.__basedir = __dirname;


require('./app/routers/router.js')(app);
const db = require('./app/config/db.config.js');
const Role = db.role;
const Category = db.category;
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
// 	console.log('Drop and Resync with { force: true }');
// 	initial();
// 	category();
	
// });

// Create a Server
var server = app.listen(8080, async function () {
	var host = server.address().address
	var port = server.address().port
	console.log("App listening at http://%s:%s", host, port)
	// app.get('/', (req, res) => {
	// 	res.send(' HELLO BINOVA SERVER STARTED SUCCESSFULLY')
	// });

	await db.sequelize.authenticate()
	console.log("Database Connected!")
})

// function initial() {
// 	Role.create({
// 		id: 1,
// 		name: "USER"
// 	});
// 	Role.create({
// 		id: 2,
// 		name: "ADMIN"
// 	});
// }
// function category() {
// 	Category.create({
// 		name: "Vegetables"
// 	});

// 	Category.create({
// 		name: "Fruits"
// 	});

	
// }