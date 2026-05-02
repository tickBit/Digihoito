import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

import Header from './Header';

const Register = () => {

    const navigate = useNavigate();
    
    const { login } = useAuth();
       
    const handleRegister = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
 
        // Make API call to register the user
        await axios.post('http://localhost:5199/register', { email, password, role: 1 }, {
                   headers: {
                    "Content-Type": "application/json",
            }})
            .then(response => {
                
                alert('Registration successful');
                
                login(email, response.data.token, 1);
                navigate('/main');
                
            })
            .catch(error => {
                
                const message =
                error.response?.data?.error ||
                error.message ||
                "Unknown error";
                
                alert('Registration failed: ' + message);
            });
        
    }
              
    return (
        <>
        <Header />
        <div className="register-login">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input className="form-field" type="text" name="email" placeholder="Email" required />
                <input className="form-field" type="password" name="password" placeholder="Password" required />
                <input className="form-field" type="password" name="confirmPassword" placeholder="Confirm Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
        </>
    );
            
}

export default Register;