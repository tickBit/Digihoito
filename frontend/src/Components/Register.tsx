import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

import './../App.css';
import Header from './Header';


const Register = () => {

    const navigate = useNavigate();
    
    const { login } = useAuth();
       
    const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
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
        axios.post('/register', { email, password })
            .then(response => {
                alert('Registration successful');
                
                login(email, response.data.token);
                navigate('/main');
                
            })
            .catch(error => {
                alert('Registration failed: ' + error.message);
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