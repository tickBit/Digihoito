import React, { useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    
    const { token, userEmail } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        
        if (!token) {
            // Redirect to login page or show a message
            alert('You must be logged in to view this page');
            navigate('/');        
        }
        
    }, [token, navigate]);
    
    return (
        <div>
            <h1>Tervetuloa {userEmail}!</h1>
            <p>Olet kirjautunut sisään onnistuneesti.</p>
        </div>
    );
}

export default MainPage;