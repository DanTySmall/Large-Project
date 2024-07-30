import React, { useState, useEffect, useContext } from 'react';
import '../main.css';
import axios from 'axios';
import { UserContext } from '../components/userProvider.js';
import SettingsHeader from '../components/SettingsHeader.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, } from '@fortawesome/free-solid-svg-icons';

const SettingsPage = () => {
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

    const { userID } = useContext(UserContext);
    const [email, setEmail] = useState('');  
    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [originalPassword, setOriginalPassword] = useState('');
    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isManualEdit, setIsManualEdit] = useState(false);
    const [usernameCriteria, setUsernameCriteria] = useState({
        length: false,
        letter: false,
        number: true,
        underscore: true,
        hyphen: true,
    });
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        letter: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        if (userID) {
            fetchUsernameAndEmail();
        }
    }, [userID]);

    useEffect(() => {
        if (username && !isManualEdit) {
            fetchPassword();
        }
    }, [username]);

    const fetchUsernameAndEmail = async () => {
        try {
            const response = await axios.post(buildPath('api/getUsername'), {
                UserId: parseInt(userID),
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            
            if (response.status === 200) {
                setUsername(response.data.Username);
                setOriginalUsername(response.data.Username);
                setEmail(response.data.Email);
            } else {
                alert('Error: ' + response.data.error);
            }
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    const fetchPassword = async () => {
        try {
            const response = await axios.post(buildPath('api/getPassword'), {
                Username: username,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setPassword(response.data.Password);
                setOriginalPassword(response.data.Password);
            } else {
                alert('Error: ' + response.data.error);
            }
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevShowConfirmPassword => !prevShowConfirmPassword);
    };

    const handleSaveUsername = async () => {
        try {
            const response = await axios.post(buildPath('api/changeUsername'), {
                userId: parseInt(userID),
                newUsername: username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('Username updated successfully');
                setIsUsernameEditable(false);
                setIsManualEdit(false);
                setOriginalUsername(username);
            } else {
                alert('Error: ' + response.data.error);
            }
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    const handleSavePassword = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(buildPath('api/changePassword'), {
                userId: parseInt(userID),
                newPassword: password,
                confirmPassword: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('Password updated successfully');
                setIsPasswordEditable(false);
                setOriginalPassword(password);
                setShowPassword(false);
            } else {
                alert('Error: ' + response.data.error);
            }
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDeletion = window.confirm("Are you sure you want to delete your account? This action cannot be undone!");
        if (confirmDeletion) {
            const response = await axios.post(buildPath('api/deleteAccount'), {
                userId: parseInt(userID),
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // const result = await response.json();
                alert("We are sad to see you go! Drink Responsibly!");
                window.location.href = '/';
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        }
    };

    const validateUsername = (username) => {
        setUsernameCriteria({
            length: username.length >= 3 && username.length <= 18,
            letter: /[a-zA-Z]/.test(username),
            number: true, // Optional
            underscore: true, // Optional
            hyphen: true, // Optional
        });
    };

    const validatePassword = (password) => {
        setPasswordCriteria({
            length: password.length >= 8 && password.length <= 32,
            letter: /[a-zA-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password),
        });
    };

    return (
        <div className="login-page">
            <div className="loginContent">
                <SettingsHeader />
                <div className="welcome-message">
                    Settings
                </div>
                <div className={"login-box"}>
                    <div className="input-form">

                            <div className="label">Username</div>
                            <input 
                                className="settings-input-box" 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={username} 
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setIsManualEdit(true);
                                    validateUsername(e.target.value);
                                }} 
                                disabled={!isUsernameEditable} 
                                required 
                                onFocus={() => document.getElementById('explanationUser').style.display = 'block'}
                                onBlur={() => document.getElementById('explanationUser').style.display = 'none'}
                            />
                            <FontAwesomeIcon icon={faPen} onClick={() => { setIsUsernameEditable(true); setIsManualEdit(false); }} className="edit-icon" />
                            {isUsernameEditable && (
                                <div className="edit-buttons">
                                    <button className="confirm-username-btn" onClick={handleSaveUsername}>Save</button>
                                    <button className="cancel-username-btn" onClick={() => { setIsUsernameEditable(false); setUsername(originalUsername); }}>Cancel</button>
                                </div>
                            )}
                            {/* Username Criteria */}
                            <div id="explanationUser" style={{ display: 'none' }}>
                                <h3>Username must contain the following:</h3>
                                <p id="userLett" className={usernameCriteria.letter ? "valid" : "invalid"}>At least one letter*</p>
                                <p id="userLen" className={usernameCriteria.length ? "valid" : "invalid"}>3 to 18 characters*</p>
                                <h3> Username may contain the following: </h3>
                                <p id="userNum" className="opt">Numbers</p>
                                <p id="userUnd" className="opt">Underscores</p>
                                <p id="userHyp" className="opt">Hyphens</p>
                            </div>

                            <div className="label">Password</div>
                            <div className="password-input-wrapper">
                                <input
                                    className="settings-input-box"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    required
                                    disabled={!isPasswordEditable} 
                                    pattern="(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}"
                                    onFocus={() => document.getElementById('explanation').style.display = 'block'}
                                    onBlur={() => document.getElementById('explanation').style.display = 'none'}
                                />
                                <button type="button" className="settings-toggle-password-btn" onClick={togglePasswordVisibility}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                <FontAwesomeIcon icon={faPen} onClick={() => { setIsPasswordEditable(true); setIsManualEdit(false); }} className="pass-edit-icon" />
                            </div>
                            {/* Password Criteria */}
                            <div id="explanation" style={{ display: 'none' }}>
                                <h3>Password must contain the following:</h3>
                                <p id="passLen" className={passwordCriteria.length ? "valid" : "invalid"}>8 to 32 characters*</p>
                                <p id="passLett" className={passwordCriteria.letter ? "valid" : "invalid"}>At least one letter*</p>
                                <p id="passNum" className={passwordCriteria.number ? "valid" : "invalid"}>At least one number*</p>
                                <p id="passSpec" className={passwordCriteria.special ? "valid" : "invalid"}>At least one special character*</p>
                            </div>
                            {isPasswordEditable && (
                                <div className="password-input-wrapper">
                                    <input
                                        className="settings-input-box"
                                        type={showConfirmPassword  ? "text" : "password"}
                                        id="confirm-password"
                                        name="confirm-password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" className="settings-toggle-newpassword-btn" onClick={toggleConfirmPasswordVisibility}>
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                    <div className="edit-buttons">
                                        <button className="confirm-username-btn" onClick={handleSavePassword}>Save</button>
                                        <button className="cancel-username-btn" onClick={() => {
                                            setIsPasswordEditable(false);
                                            setPassword(originalPassword);
                                            setConfirmPassword('');
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            <div className="label">Email</div>
                            <input 
                                className="settings-input-box" 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                disabled 
                                required 
                            />
                        <div id="error" className="email-error">Please enter a valid email address.</div>
                        <div className="delete-account-container">
                            <button type="button" className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
