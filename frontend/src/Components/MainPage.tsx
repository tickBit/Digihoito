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
    
    /*
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = formData.get('message') as string;

        if (!caseId) return;

        try {

            await httpClient.post(`/cases/${caseId}/messages`, {
                content: message
            });

            const response = await httpClient.get(`/cases/${caseId}`);

            setMessages(response.data.messages);

            e.currentTarget.reset();

        } catch (error) {

            console.error(error);

        }
    };
    */
    
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
                    headers: {
                        Authorization: `Bearer ${token}`,
                }})

                console.log(response.data);
                setMessages(response.data.messages);

            } catch (error) {
                console.error(error);
            }
        };

        if (caseId !== null) fetchCase(caseId);

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