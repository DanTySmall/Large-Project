const nodemailer = require('nodemailer');

//Generates a unique string used for the verification link
const randString = () => {
    const length = 10
    let string = ''
    for(let i = 0; i < length; i++){
        const character = Math.floor((Math.random() * 10) + 1)
        string += character
    }

    return string
}

//Sends verification or change password emails to user
const sendMail = (Email, uniqueString, flag) => {
    const Transport = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com", //
        port: 465,
        secure: true,
        auth: {
            user: '', // Use your gmail username
            pass: '' // Use an App Password, not your gmail password 
                      //(Manage Your Google Account -> Security -> 2-Step Verification -> App Passwords)
        }
    })

    let mailOptions
    if(flag === 1){
        mailOptions = {
            from: 'noreply@domain.com',  //Change later   
            to: Email,
            subject: "Email Confirmation",
            html: `Press <a href=https://paradise-pours-4be127640468.herokuapp.com/verify/${uniqueString}> here </a> to verify your email.` //Links to the api/verify
        }    
    }
    else{
        mailOptions = {
            from: 'noreply@domain.com',  //Change later   
            to: Email,
            subject: "Change Password",
            html: `Press <a href=https://paradise-pours-4be127640468.herokuapp.com/changePassword/${uniqueString}> here </a> to change your password.` //Links to the api/changePassword
        }      
    }

    console.log(mailOptions)
    Transport.sendMail(mailOptions, function(error, res){
        if(error){
            console.log("Email was not sent.")
            console.log(error)
        }
        else{
            console.log("Email was sent.")
        }
    })

}

module.exports = {randString, sendMail}
