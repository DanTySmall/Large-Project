import axios from 'axios';
import React, { useState } from 'react';
import LoginHeader from '../components/LoginHeader';
import '../main.css';
import RegisterValidation from '../components/RegisterValidation';

function LoginPage(){
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

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [lastLoginAttempt, setLastLoginAttempt] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const formData = isLogin ? { "Username": username, "Password": password } : { "FirstName": firstName, "LastName": lastName, "Username": username, "Password": password, "Email": email, "Phone": phone };

    const validateForm = () => {
        if (isLogin) {
            if (!username || !password) {
                setErrorMessage('All fields must be filled');
                setLastLoginAttempt(true);
                return false;
            }
        } else {
            if (!firstName || !lastName || !username || !password || !email || !phone) {
                setErrorMessage('All fields must be filled');
                return false;
            }
        }
        setErrorMessage('');
        return true;
    };

    async function loginButtonHandler(event){
        event.preventDefault(); // Prevent form from submitting
        const errorElement = document.getElementById('error');
        const missFielderrorElement = document.getElementById('miss-field-error');
        const notVerifiedError = document.getElementById('notVerifiedError');

        if (!validateForm()) {
            missFielderrorElement.style.display = 'block';
            errorElement.style.display = 'none';
            return;
        }else {
            missFielderrorElement.style.display = 'none';
        }

        if (!lastLoginAttempt) {
            errorElement.style.display = 'block';
            missFielderrorElement.style.display = 'none';
            return;
        } else {
            errorElement.style.display = 'none';
        }

        try{
            //const resp = await axios.post('http://localhost:5000/api/login', {
            const resp = await axios.post(buildPath('api/login'), {
                Username: formData.Username,
                Password: formData.Password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(resp);
            console.log("Login Successful: ", resp);
            window.location.href = '/homepage';
            setLastLoginAttempt(true);
        }
        catch(error){
            if(error.response.status === 401){
                console.log("Account has not been verified");
                notVerifiedError.style.display = 'block';
                errorElement.style.display = 'none';
                missFielderrorElement.style.display = 'none';
            }else if(error.response.status === 404){
                console.log("Login failed...");
                setLastLoginAttempt(false);
                errorElement.style.display = 'block';
                missFielderrorElement.style.display = 'none';
                notVerifiedError.style.display = 'none';
            }
        }
    }

    async function registerButtonHandler(event){
        event.preventDefault(); // Prevent form from submitting
        const missFielderrorElement = document.getElementById('miss-field-error');
        const usernameErrorElement = document.getElementById('usernameError');
        const emailErrorElement = document.getElementById('emailError');

        if (!validateForm()) {
            missFielderrorElement.style.display = 'block';
            return;
        }else {
            missFielderrorElement.style.display = 'none';
        }

        try{
            //const resp = await axios.post('http://localhost:5000/api/register', {
            const resp = await axios.post(buildPath('api/register'), {
            FirstName: formData.FirstName,
            LastName: formData.LastName, 
            Email: formData.Email, 
            Phone: formData.Phone,
            Username: formData.Username,
            Password: formData.Password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(resp);
            console.log("User Registered: ", resp);
            window.location.href = '/';
        }
        catch(error){
            if(error.response.status === 409){
                const errorMessage = error.response.data.error;
                if(errorMessage === 'Username already exists'){
                    console.log("Username already exists");
                    usernameErrorElement.style.display = 'block';
                    emailErrorElement.style.display = 'none';
                }else if(errorMessage === 'Email already exists'){
                    console.log("Email already exists");
                    emailErrorElement.style.display = 'block';
                    usernameErrorElement.style.display = 'none';
                }
            }
            else{
                console.log("Registration failed...");
                missFielderrorElement.style.display = 'none';
                usernameErrorElement.style.display = 'none';
                emailErrorElement.style.display = 'none';
            }
        }
        
    }

    const handleToggle = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
        setErrorMessage(''); 
        setLastLoginAttempt(true); 
        document.getElementById('error').style.display = 'none';
        
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePhoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setPhone(formattedPhoneNumber);
    };

    return(
        <div className="login-page">
            <div className="loginContent">
                <LoginHeader />
                <div className="welcome-message">
                    Welcome to Paradise Pours - Your Ultimate Alcohol Atlas!
                </div>
                <div className={`login-box ${isLogin ? '' : 'register'}`}>
                    <div className="toggle-container">
                        <div className="switch-container">
                            <label className="switch">
                                <input type="checkbox" checked={!isLogin} onChange={handleToggle} />
                                <span className="slider">
                                    <span className="slider-label login-label">Login</span>
                                    <span className="slider-label register-label">Register</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className = "input-form">
                        { !isLogin && (
                            <>
                                <div className="label">First Name</div>
                                <input className="input-box" type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                <div className="label">Last Name</div>
                                <input className="input-box" type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                <div className="label">Email</div>
                                <input className="input-box" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"/>
                                <div className="label">Phone</div>
                                <input className="input-box" type="tel" id="phone" name="phone" placeholder="XXX-XXX-XXXX" value={phone} onChange={handlePhoneChange} required pattern="^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$"/>
                                <div className="label">Username</div>
                                <input className="input-box" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required pattern="(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$"/>
                                <div className="label">Password</div>
                                <input className="input-box" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required pattern="(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}"/>
                            </>
                        )}
                        { isLogin && (
                            <>                            
                                <div className="label">Username</div>
                                <input className="input-box" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required pattern="(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$"/>
                                <div className="label">Password</div>
                                <input className="input-box" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required pattern="(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}"/>
                            </>
                        )}
                        
                    </div>
                    <button type="button" onClick={isLogin ? loginButtonHandler : registerButtonHandler} className="login-button">{isLogin ? "Login" : "Register"}</button>
                    
                    <div id="miss-field-error" className="login-error">{errorMessage}</div>
                    <div id="error" className="login-error">Incorrect username or password<br></br>Please try again!!</div>
                    <div id="notVerifiedError" className="login-error">This account has not been verified!<br></br>Please check your email!!</div>
                    <div id="usernameError" className="login-error">Username already in use!<br></br>Please try another!!</div>
                    <div id="emailError" className="login-error">Email already used!<br></br>Please try another!!</div>
                    <a href="/forgotPass" className="forgot-password">{isLogin ? "Forgot Password?" : ""}</a>

                    {/* Username Criteria */}
                    <div id="explanationUser" style={{ display: 'none' }}>
                        { !isLogin && (
                            <>
                                <h3>Username must contain the following:</h3>
                                <p id="userLett" className="invalid">At least one letter*</p>
                                <p id="userLen" className="invalid">3 to 18 characters*</p>
                                <h3> Username may contain the following: </h3>
                                <p id="userNum" className="opt">Numbers</p>
                                <p id="userUnd" className="opt">Underscores</p>
                                <p id="userHyp" className="opt">Hyphens</p>
                            </>
                        )}    
                    </div>
                    {/* Password Criteria */}
                    <div id="explanation" style={{ display: 'none' }}>
                        { !isLogin && (
                            <>
                                <h3>Password must contain the following:</h3>
                                <p id="passLen" className="invalid">8 to 32 characters*</p>
                                <p id="passLett" className="invalid">At least one letter*</p>
                                <p id="passNum" className="invalid">At least one number*</p>
                                <p id="passSpec" className="invalid">At least one special character*</p>
                            </>
                        )}   
                    </div>
                </div>
                {!isLogin && <RegisterValidation isLogin={isLogin} />}
            </div>
        </div>
    );
}

export default LoginPage;
