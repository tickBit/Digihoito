import React, { useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import './../App.css';
import Header from './Header';

const MainPage = () => {
    
    const { token, userEmail } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const message = formData.get('message') as string;
        
        console.log('Lähetetty viesti:', message);
    };
    
    useEffect(() => {
        
        if (!token) {
            // Redirect to login page or show a message
            alert('You must be logged in to view this page');
            navigate('/');        
        }
        
    }, [token, navigate]);
    
    return (
        <>
        <Header />
        <div className='welcome'>
            <h1>Tervetuloa {userEmail}!</h1>
            <p>Olet kirjautunut sisään onnistuneesti.</p>
        </div>
        
            <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Voit ottaa yhteyttä asiantuntijaamme</h2>
                <label htmlFor="message">Viesti:</label>
                <textarea id="message" name="message" required></textarea>
                <button type="submit">Lähetä</button>
            </form>
        </>
    );
}

export default MainPage;