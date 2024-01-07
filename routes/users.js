const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


require('dotenv').config();
let auth = require('../services/authentication');
let checkRole = require('../services/checkRole');

router.post('/singup', (req, res) => {
    let user = req.body;
    let query = 'select email, password from user where email =?';
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0){
                query = "insert into user(name,contactNumber,email,password,status,role) values (?,?,?,?,'false', 'user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if(!err){
                        return res.status(201).json({message: 'User created successfully'});
                    }else{
                        console.error(err);
                        console.log(res.body);
                        return res.status(500).json(err);
                    }
                });  
            }else{
                return res.status(400).json({message: 'Email already exists'});
            }
        }else{
            console.error(err);
            console.log(res.body);
            return res.status(500).json(err);
        }
    });
});

router.post('/login', (req, res) => {
    let user = req.body;
    let query = "select email, password, role, status from user where email =?";
    connection.query(query, [user.email, user.password], (err, results) => {
        if(!err){
            if(results.length <= 0 || results[0].password != user.password){
                return res.status(401).json({message: 'Incorrect Username(email) or Password'});
            }else if(results[0].status == 'false'){
                return res.status(401).json({message: 'Panding for Admin Approval'});
            }else if(results[0].password == user.password && results[0].status == 'true'){
                const response = { email: results[0].email, role: results[0].role};
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                return res.status(200).json({token: accessToken, message: 'Login Successful'});
            }else{
            console.error(err);
            return res.status(400).json({message: 'Something went wrong, please try again later'});
            }
        }else{
            return res.status(500).json(err);
        }
    });
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD 
    }
});

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = 'select email,password from user where email=?';
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0){
                return res.status(200).json({message: 'Password send successfully to your email ' + user.email});
            }else{
                let mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Cafe Menagement System',
                    text: 'Hello'+ user.email + ',\n\n' + 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n',
                    html: '<p>'+text+'</p></br><p><b>Your Login Credentials for Cofe</b></br><b>Email: </b>' +results[0].email + '</br> <b>Password: </b>' +results[0].password+ '<br><a href="http://localhost:4200/">Click here to login</a></p>',

                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if(err){
                        console.error(err);
                    }else{
                        console.log('Email sent: '+ info.response);
                        
                    }
                });

                return res.status(200).json({message: 'Password send successfully to your email '+ user.email});
            } 

        }
        else{
            return res.status(500).json(err);
        }
    });
});


router.get('/get', auth.verifyToken, (req, res) => {
    let query = "select id, name, email, contactNumber, status from user where status = 'true'";
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });
});

router.patch('/statusUpdate', auth.verifyToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    let query = "update user set status =? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if(!err){
            if(results.affectedRows == 1){
                return res.status(200).json({message: 'User updated successfully'});
            }
            return res.status(404).json({message: 'User not found'});
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('/checkToken', auth.verifyToken, (req, res) => {
    return res.status(200).json({message: 'true'});
});

router.post('/changePassword', auth.verifyToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    let query = 'select *from user where email =? and password =?';
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if(!err){
            if(results.length <= 0){
                return res.status(400).json({message: 'Incorrect Old Password'});
            }else if(results[0].password == user.oldPassword){
                query = 'update user set password =? where email =?';
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if(!err){
                        return res.status(200).json({message: 'Password changed successfully'});
                    }else{
                        return res.status(500).json(err);
                    }
                });
            }else{
                return res.status(400).json({message: 'Something went wrong, please try again later'});
            }
        }else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;