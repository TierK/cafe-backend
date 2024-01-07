const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/add', auth.verifyToken, checkRole.checkRole, (req, res) => {
    let category = req.body;
    query = "insert into category(name) values (?)";
    connection.query(query, [category.name], (err, results) => {
        if(!err){
            return res.status(201).json({message: 'Category added successfully'});
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.verifyToken, (req, res, next) => {
    let query = "select * from category order by name";
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });

});

router.patch('/update', auth.verifyToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    let query = "update category set name =? where id=?";
    connection.query(query, [category.name, category.id], (err, results) => {
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: 'Category not found'});
            }
            return res.status(200).json({message: 'Category updated successfully'});
        }else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;