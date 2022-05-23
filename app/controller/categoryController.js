const db = require("../config/db.config.js");
const config = require("../config/config.js");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const mime = require("mime");
const fs = require("fs");
const { category, postadd } = require("../config/db.config.js");
const { body } = require("express-validator");
const {ValidationError} = require('sequelize');

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


exports.createCategory = async(req, res) => {
    console.log("Create Category ===> ");

    let { name } = req.body;

    if (!name) {
        res.status(400).json({error: "Category name must be required"});
    }

    try {
        const cat = await category.create({name});
        return res.json({category: cat})
    } catch (error) {
        if( error instanceof ValidationError) {
            return res.status(400).json({
                error: error.errors
            })
        }
        return res.status(500).json({
            error: error
        })
    }
}

exports.getCategory = async(req, res) => {
    console.log("Get Single Category ===>")
    
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({error: "category id must be required"});
    }

    try {
        let cat = await category.findOne({
            where: {
                id: id
            }
        })

        return res.json({category: cat})
    } catch (error) {
        return res.status(500).json({error: error})
    }
}


exports.updateCategory = async(req, res) => {
    console.log("Update Category ===>")
    
    let { id } = req.params;
    let { name } = req.body;

    if (!id) {
        return res.status(400).json({error: "category id must be required"});
    }

    try {
        let cat = await category.findOne({
            where: {
                id: id
            }
        })

        cat.name = name;

        await cat.save();

        return res.json({category: cat})
    } catch (error) {
        return res.status(500).json({error: error})
    }
}


exports.deleteCategory = async(req, res) => {
    console.log("Delete Category ===>")
    
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({error: "category id must be required"});
    }

    try {
        let cat = await category.findOne({
            where: {
                id: id
            }
        })

        await cat.destroy();

        return res.json({message: "Category Deleted Successfully"})
    } catch (error) {
        return res.status(500).json({error: error})
    }
}