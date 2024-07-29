const {registerController} = require ('./Controllers/registerController');
const {loginController} = require ('./Controllers/loginController');
const express = require('express');
const {getClient} = require('../database');
const {generateToken} = require('../jwtUtils')
const {randString, sendMail} = require('../emailUtils')
const router = express.Router();

//API Section
// User Registration
router.post('/register', registerController);

// User Login
router.post('/login', loginController);

// User Verification - Verifies user in the database when they click email link.
router.get('/verify/:uniqueString', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const{uniqueString} = req.params
    const result = await db.collection('Users').updateOne({ uniqueString: uniqueString }, { $set: { Verified: true } })// Finds user using uniqueString then updates Verified to true
    console.log(result)
    if(result.matchedCount > 0){
        res.status(200).json({Message:"User has been successfully verified"})
    }
    else{
        return res.status(404).json({error:"Error validating user"})
    }
})

//Forget Password - User enters email address and email is sent with a link to change password
router.post('/recoverAccount', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {Email} = req.body
    const uniqueString = randString()
    const result = await db.collection('Users').updateOne({ Email: Email }, { $set: { uniqueString: uniqueString } })
    if(result.matchedCount > 0){
        sendMail(Email, uniqueString, 2)
        res.status(200).json({Message:"Recovery email has been sent"})
    }
    else{
        return res.status(404).json({error:"Email not found"})
    }
})

//Gets the change password page from email link
router.get('/changePassword/:uniqueString', async(req,res) => {
    const{uniqueString} = req.params
    if(uniqueString){    
            res.status(200).json({Message:"Directing user to change password"})
        }
    else{
        return res.status(401).json({error:"Error with directing user"})
    }
})

//Change Password - Requires the user to successfully input a new password and the same password again to confirm it
router.post('/changePassword/:uniqueString', async(req,res) => {
    const db = getClient().db('AlcoholDatabase')

    const{uniqueString} = req.params
    const{newPassword, confirmPassword} = req.body

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: 'New Password does not meet the criteria.' });
    }

    console.log(newPassword, confirmPassword)
    if(newPassword === confirmPassword){    
        const result = await db.collection('Users').updateOne({ uniqueString: uniqueString }, { $set: { Password: newPassword } })
        if(result){
            res.status(200).json({Message:"User has successfully changed their password"})
        }
        else{
            return res.status(400).json({error:"Error changing password"})
        }
    }
    else{
        return res.status(401).json({error:"Passwords do not match"})
    }
})

module.exports = router;
