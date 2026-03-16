import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import './../App.css';
import Header from './Header';
import { MessageDto } from '../types/case';

const MainPage = () => {
    
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [caseId, setCaseId] = useState<string | null>(null);

    const { token, userEmail } = useAuth();
    const navigate = useNavigate();
    
    
    const handleSecondarySubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = formData.get('msg') as string;

        if (!caseId) return;

        try {

            await axios.post(`http://localhost:5199/cases/${caseId}/messages`, { content: message },
            {    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
            });

            const response = await axios.get(`http://localhost:5199/cases/${caseId}`);

            setMessages(response.data.messages);

            e.currentTarget.reset();

        } catch (error) {

            console.error(error);

        }
    };
    
    
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = formData.get('message') as string;
    
        try {

            await axios.post("http://localhost:5199/cases", { InitialMessage: message },   // dto
                    {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }}).then(response => {

                        const caseId = response.data;
                        setCaseId(caseId);
                        
                        e.currentTarget.reset();
                    });


        } catch (error) {

            console.error(error);

        }
    };
    
    useEffect(() => {

        if (!token) {
            alert('You must be logged in to view this page');
            navigate('/');
            return;
        }

        const fetchCase = async (caseId:string) => {
            try {

                // tässä oletetaan että backend palauttaa käyttäjän casen
                const response = await axios.get(`http://localhost:5199/cases/${caseId}`, {
                    headers: { Authorization: `Bearer ${token}`},
                })

                console.log(response.data);
                setMessages(response.data.messages);

            } catch (error) {
                console.error(error);
            }
        };

        const fetchCases = async() => {
            await axios.get("http://localhost:5199/cases", {
                headers: { Authorization: `Bearer ${token}` },
                
            }).then(response => {
                console.log(response.data);
                setMessages(response.data);
            }).catch(error => {
                console.log(error);
            })
        }
        
        if (caseId !== null) fetchCase(caseId);

        if (token) fetchCases();
        
        return () => {
                
        }
        
    }, [token, navigate, caseId]);
    
    return (
        <>
        <Header />
        <div className='welcome'>
            <h1>Tervetuloa {userEmail}!</h1>
            <p>Olet kirjautunut sisään onnistuneesti.</p>
        </div>
        
        <div className="chat-window">
            {messages.map((m) => (

                <div key={m.id} className="chat-message">

                    <div>
                        {m.content}
                    </div>

                    <small>
                        {new Date(m.createdAt).toLocaleTimeString()}
                    </small>

                </div>

            ))}
            <form className="chat-form" onSubmit={handleSecondarySubmit}>
                <h2>Vastaa viestiin</h2>
                <textarea id="msg" name="msg" required></textarea>
                <br />
                <button type="submit">Lähetä</button>
            </form>
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