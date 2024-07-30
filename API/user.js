const registerController = require ('./registerController');
const loginController = require ('./loginController');
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

// Retrieve User Username
router.post('/getUsername', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { UserId } = req.body;

    const result = await db.collection('Users').findOne({ UserId: UserId });

    if (result) {
        res.status(200).json({ Username: result.Username, Email: result.Email });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Retrieve User Password
router.post('/getPassword', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { Username } = req.body;

    const result = await db.collection('Users').findOne({ Username: Username });

    if (result) {
        res.status(200).json({ Password: result.Password });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Change Username
router.post('/changeUsername', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { userId, newUsername } = req.body;

    const result = await db.collection('Users').findOneAndUpdate(
        { UserId: userId },
        { $set: { Username: newUsername } },
        { new: true }
    );

    if (result) {
        res.status(200).json({ message: 'Username updated successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete Account
router.post('/deleteAccount', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { userId } = req.body;

    const result = await db.collection('Users').findOneAndDelete({ UserId: userId });

    if (result) {
        res.status(200).json({ message: 'Account deleted successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// New Change Password API call to change directly though the app
router.post('/changePassword', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { userId, newPassword, confirmPassword } = req.body;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: 'New Password does not meet the criteria.' });
    }

    if (newPassword === confirmPassword) {
        const result = await db.collection('Users').updateOne(
            { UserId: userId },
            { $set: { Password: newPassword } }
        );
        if (result.modifiedCount > 0) {
            res.status(200).json({ Message: 'User has successfully changed their password' });
        } else {
            res.status(400).json({ error: 'Error changing password' });
        }
    } else {
        res.status(401).json({ error: 'Passwords do not match' });
    }
});

module.exports = router;
