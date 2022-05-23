const db = require("../config/db.config.js");
const config = require("../config/config.js");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const mime = require("mime");
const fs = require("fs");
const { category, postadd } = require("../config/db.config.js");
const { body } = require("express-validator");

//Declaring Databases
const Register = db.register;

const Role = db.role;
const Op = db.Sequelize.Op;
const Product = db.product;
const AddtoCart = db.addtocart;
const Package = db.package;
const PostAdd = db.postadd;



exports.getCategories = (req,res) => {
    console.log('Get Categories');
    category.findAll({
        attributes: ['id', 'name'],
    }).then(categories => {
          res.status(200).json({  categories: categories });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}