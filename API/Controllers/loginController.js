const {getClient} = require('../../database');
const {generateToken} = require('../../jwtUtils')

async function loginController(req, res, next){
    const db = getClient().db('AlcoholDatabase')
    const { Username, Password } = req.body
    const results = await db.collection('Users').find({ Username:Username,Password:Password}).toArray()
    let user

    if( results.length > 0 && results[0].Verified) {
        user = results[0]
    }
    else if(results.length > 0 && !results[0].Verified){
        return res?.status(401).json({error:"Account has not been verified"}) 
    }
    else{
        return res?.status(404).json({error:"Invalid Username or Password"})
    }

    const token = generateToken(user.UserId)
    var ret = {user, token, Message:"User successfully logged in"}
    res?.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json(ret)
}

module.exports = {loginController};