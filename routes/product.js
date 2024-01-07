const express = require('express');
const connection = require('../connection');

const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/add', auth.verifyToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    let query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if(!err){
            return res.status(201).json({message: 'Product added successfully'});
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.verifyToken, (req, res, next) => {
    let query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });
});


router.get('/getByCategory/:id', auth.verifyToken, (req, res) => {
    const id = req.params.id;
    let query = "slect id,name from product where categoryId =? and status = 'true'";
    connection.query(query, [id], (err, results) => {
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('getById/:id', auth.verifyToken, (req, res, next) =>{
    const id = req.params.id;
    let query = "select id,name,description,price from product where id =? and status = 'true'";
    connection.query(query, [id], (err, results) => {
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;