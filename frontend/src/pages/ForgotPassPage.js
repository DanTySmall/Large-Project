import React, { useState } from 'react';
import axios from 'axios';
import AboutUsHeader from '../components/AboutUsHeader';
import '../main.css';

const ForgotPassPage = () =>{
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
    const [email, setEmail] = useState('');

    const handleSubmit = async(event) =>{
        event.preventDefault(); // Prevent form from submitting

        // Regular expression for basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById('error');

        if (!emailPattern.test(email)) {
            errorElement.style.display = 'block';
            return;
        } else {
            errorElement.style.display = 'none';
        }

        try {
            //const response = await axios.post('http://localhost:5000/api/recoverAccount', { Email: email });
            const response = await axios.post(buildPath('api/recoverAccount'), { Email: email });

            if (response.status === 200) {
                console.log('Response:', response.data.Message);
                window.location.href = '/';
            } else if (response.status === 404) {
                console.log('Response:', response.data.Message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return(
        <div className="login-page">
            <div className="loginContent">
                <AboutUsHeader />
                <div className="welcome-message">
                    Recover Password
                </div>
                <div className={"login-box"}>
                    <div class = "input-form">
                        <div class="email-message">Please insert the email used to create the account.</div>
                        <div className="label">Email</div>
                        <input className="input-box" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="button" onClick={handleSubmit} className="login-button">Submit</button>
                        <div id="error" class="email-error">Please enter a valid email address.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassPage;
