import React, { useState, useEffect} from 'react';
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
    const [errorMessage, setErrorMessage] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
            const passform = document.getElementById("new-password");
            const totalform = document.querySelector(".login-box");

            // Password criteria elements
            const pLenInput = document.getElementById("passLen");
            const pLettInput = document.getElementById("passLett");
            const pNumInput = document.getElementById("passNum");
            const pSpecInput = document.getElementById("passSpec");

            // Password validation
            passform.onfocus = function () {
                document.getElementById("explanation").style.display = "block";
                totalform.style.minHeight = "570px";
            };
            passform.onblur = function () {
                document.getElementById("explanation").style.display = "none";
                totalform.style.minHeight = "360px";
            };
            passform.onkeyup = function () {
                const nums = /[0-9]/g;
                const lett = /[a-zA-Z]/g;
                const spec = /[!@#$%^&*]/g;

                // Check length
                if (passform.value.length >= 8 && passform.value.length <= 32) {
                    pLenInput.classList.remove("invalid");
                    pLenInput.classList.add("valid");
                } else {
                    pLenInput.classList.remove("valid");
                    pLenInput.classList.add("invalid");
                }

                // Check numbers
                if (passform.value.match(nums)) {
                    pNumInput.classList.remove("invalid");
                    pNumInput.classList.add("valid");
                } else {
                    pNumInput.classList.remove("valid");
                    pNumInput.classList.add("invalid");
                }

                // Check letters
                if (passform.value.match(lett)) {
                    pLettInput.classList.remove("invalid");
                    pLettInput.classList.add("valid");
                } else {
                    pLettInput.classList.remove("valid");
                    pLettInput.classList.add("invalid");
                }

                // Check special characters
                if (passform.value.match(spec)) {
                    pSpecInput.classList.remove("invalid");
                    pSpecInput.classList.add("valid");
                } else {
                    pSpecInput.classList.remove("valid");
                    pSpecInput.classList.add("invalid");
                }
            };
    }, []);

    const handleSubmit = async() =>{
        const missFielderrorElement = document.getElementById('miss-field-error');
        
        //const response = await axios.post(`http://localhost:5000/api/changePassword/${uniqueString}`, {
        try{
            const response = await axios.post(buildPath(`api/changePassword/${uniqueString}`), {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })

            console.log('Response:', response.data.Message);  
            window.location.href='/'  
        }
        catch(error){
            missFielderrorElement.style.display = 'block';
            const errorMessage = error.response.data.error;
            setErrorMessage(errorMessage)
        }

    }

    const togglePasswordVisibility = () => {
        setShowNewPassword(prevShowPassword => !prevShowPassword);
    };

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
                        <div className="password-input-wrapper">
                        <div className="label">New Password</div>
                            <input className="input-box" type={showNewPassword ? "text" : "password"} id="new-password" name="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            <button type="button" className="toggle-newpassword-btn" onClick={togglePasswordVisibility}>
                                        {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="label">Confirm Password</div>
                        <input className="input-box" type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="button" onClick={handleSubmit} className="login-button">Reset Password</button>
                    </div>
                    <div id="miss-field-error" className="login-error">{errorMessage}</div>
                    {/* Password Criteria */}
                    <div id="explanation" style={{ display: 'none' }}>
                    {
                    <>
                        <h3>Password must contain the following:</h3>
                        <p id="passLen" className="invalid">8 to 32 characters*</p>
                        <p id="passLett" className="invalid">At least one letter*</p>
                        <p id="passNum" className="invalid">At least one number*</p>
                        <p id="passSpec" className="invalid">At least one special character*</p>
                    </>

                    }   
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
