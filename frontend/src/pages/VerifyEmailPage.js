import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../main.css';

const VerifyEmailPage = () =>{
    const app_name = 'paradise-pours-4be127640468'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }

    const {uniqueString} = useParams()

    useEffect(() => {
        const verifyEmail = async() => {
            try{
                console.log(uniqueString)
                //const response = await axios.get(`http://localhost:5000/api/verify/${uniqueString}`)
                const response = await axios.get(buildPath(`spi/verify/${uniqueString}`))
                console.log(response.data)
                if(response.status === 200){
                    console.log('Response:', response.data.Message);    
                    const timer = setTimeout(() => {
                        window.location.href = '/';
                      }, 2000); //Returns user to login page after 2 seconds

                    return () => clearTimeout(timer);
                }
            }
            catch (error){
                console.error("Issues verifying email")
            }
        }

        verifyEmail()
    })


    return(
        <div className="login-page">
            <div className="loginContent">
                <div className="welcome-message">
                    Email Account has been verified! Redirecting to login page...
                </div>
            </div>

        </div>
    )
}

export default VerifyEmailPage;
