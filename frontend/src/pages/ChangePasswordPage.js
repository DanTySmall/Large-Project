import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AboutUsHeader from '../components/AboutUsHeader';
import '../main.css';

const ChangePasswordPage = () =>{
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
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async() =>{
        //const response = await axios.post(`http://localhost:5000/api/changePassword/${uniqueString}`, {
        const response = await axios.post(buildPath(`api/changePassword/${uniqueString}`), {
            newPassword: newPassword,
            confirmPassword: confirmPassword
        })

        if(response.status === 200){
            console.log('Response:', response.data.Message);  
            window.location.href='/'  
        }
        else if(response.status === 400){
            console.log('Response:', response.data.Message);  
        }
    }

    return(
        <div className="login-page">
            <div className="loginContent">
                <AboutUsHeader />
                <div className="welcome-message">
                    Recover Password
                </div>
                <div className="login-box">
                    <div class = "input-form">
                        <div class="reset-message">Don't worry, it happens to the best of us! We got you!</div>
                        <div className="label">New Password</div>
                        <input className="input-box" type="password" id="new-password" name="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <div className="label">Confirm Password</div>
                        <input className="input-box" type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="button" onClick={handleSubmit} className="login-button">Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
