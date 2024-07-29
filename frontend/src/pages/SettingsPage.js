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
    const [password, setPassword] = useState('');
    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsername();
        fetchPassword();
    }, []);

    const fetchUsername = async () => {
        alert("User ID: " + userID);
        try {
            const response = await axios.post(buildPath('api/getUsername'), {
                userId: userID,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setUsername(response.data.Username);
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

    const handleDeleteAccount = async () => {
        alert("User ID: " + userID);
        const confirmDeletion = window.confirm("Are you sure you want to delete your account? This action cannot be undone!");
        if (confirmDeletion) {
            const response = await axios.post(buildPath('api/deleteAccount'), {
                userId: userID,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const result = await response.json();
                alert(result.message);
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        }
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
                                onChange={(e) => setUsername(e.target.value)} 
                                disabled={!isUsernameEditable} 
                                required 
                            />
                            <FontAwesomeIcon icon={faPen} onClick={() => setIsUsernameEditable(!isUsernameEditable)} className="edit-icon" />
                            <div className="label">Password</div>
                            <div className="password-input-wrapper">
                                <input
                                    className="settings-input-box"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={!isPasswordEditable} 
                                    pattern="(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}"
                                />
                                <button type="button" className="settings-toggle-password-btn" onClick={togglePasswordVisibility}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                <FontAwesomeIcon icon={faPen} onClick={() => setIsPasswordEditable(!isPasswordEditable)} className="pass-edit-icon" />
                            </div>

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
