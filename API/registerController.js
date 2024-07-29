const {getClient} = require('../database');
const {randString, sendMail} = require('../emailUtils')

async function registerController(req, res, next){
    const db = getClient().db('AlcoholDatabase')
    const {FirstName, LastName, Username, Password, Email, Phone} = req.body

    const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!usernameRegex.test(Username)) {
        return res?.status(400).json({ error: 'Username does not meet the criteria.' });
    }
    if (!passwordRegex.test(Password)) {
        return res?.status(400).json({ error: 'Password does not meet the criteria.' });
    }
    if (!emailRegex.test(Email)) {
        return res?.status(400).json({ error: 'Email is not valid.' });
    }
    if (!phoneRegex.test(Phone)) {
        return res?.status(400).json({ error: 'Phone number is not valid.' });
    }

    //Verification to check if username and email exists in the database
    let results = await db.collection('Users').find({ Username:Username}).toArray()
    if(results.length > 0){
        return res?.status(409).json({ error: 'Username already exists' });
    }
    results = await db.collection('Users').find({ Email:Email}).toArray()
    if(results.length > 0){
        return res?.status(409).json({ error: 'Email already exists' });
    }

    //Used to auto-increment UserId using last register user's id
    let nextUserId
    const lastUser = await db.collection('Users').find().sort({ UserId:-1 }).limit(1).toArray()
    if(lastUser.length > 0){
        nextUserId = lastUser[0].UserId + 1
    }
    else{
        nextUserId = 1
    }

    const uniqueString = randString() //Used to help create a unique verification link that is attached to the user's account

    const user = {UserId:nextUserId, FirstName, LastName, Username, Password, Email, Phone, Verified:false, uniqueString, Drinks:[]}

    await db.collection('Users').insertOne(user)
    sendMail(Email, uniqueString, 1)

    var ret = {user, Message:"User successfully registered. Verification email has been sent."}
    res.status(201).json(ret)
}
module.exports = {registerController};