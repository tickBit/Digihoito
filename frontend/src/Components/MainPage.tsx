import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../Components/MessageBubble";
import MessageInput from "../Components/MessageInput";
import { MessageDto } from "../types/case";
import Header from './Header';

const MainPage = () => {
  
  type CaseObject = {
    id: string
    createdAt: Date
    isLocked: boolean
    subject: string
    unreadCount: number
  }

  const navigate = useNavigate();

  const { token, userId, userEmail } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDto[] | null>(null);
  const [cases, setCases] = useState<CaseObject[] | null>(null);
                       
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const getCases2 = async(token:string) => {
        await axios.get(
                            "http://localhost:5199/cases",
                            {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                            }
                          ).then(response => {
                            
                            const data = response.data;
  
                            setCases(data);
                            
                            
                          }).catch(error => {
                            console.log(error);
                          });
    
      }
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

            await axios.post(`http://localhost:5199/cases`, { Subject: subject, InitialMessage: message },   // dto
                    {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }}).then(response => {

                        const caseId = response.data;
                        
                        setCaseId(caseId);                        
                        
                    }).catch(error => { 
                        console.log(error);
                    })
    };

  
  const fetchCaseMessages = async (id: string) => {
    
    await axios.get(`http://localhost:5199/cases/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        console.log("ho",res);
        setMessages(res.data.messages);
        
    }).catch(error => {
      console.log(error);
    })
    
  };
  
  const sendMessage = async (text: string) => {

    console.log(text, caseId);
    if (!caseId) return;

    await axios.post(
        `http://localhost:5199/cases/${caseId}/messages`,
        { content: text },
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        }
    ).then(resp => {
      console.log(resp);
      
      fetchCaseMessages(caseId);
    }).catch(error => {
      console.log(error);
    })
      
  };

  
  useEffect(() => {
    
    const getCases = async(token:string) => {
        await axios.get(
                            "http://localhost:5199/cases",
                            {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                            }
                          ).then(response => {
                            
                            const data = response.data;
                            console.log(data)
                            setCases(data)
                                                        
                          }).catch(error => {
                            console.log(error);
                          });
    
      }
    
    const initChat = async () => {

      if (!token) {
        alert('You must be logged in to view this page');
        navigate('/');
        return;
      }
        
        getCases(token!)
      };
  
  initChat();
    
  return () => {
    
  }
  
}, [token, navigate, caseId]);

  useEffect(() => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5199/hubs/cases", {
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessages", (messages) => {
    console.log(messages);
    setMessages(messages)
    console.log("testi");
  });

  connection.start()
    .then(() => {
      console.log("Connected");
    })
    .catch(err => {
      console.error("SignalR start error:", err);
    });

  connectionRef.current = connection;

  return () => {
    connection.stop();
  };
}, [token]);
  
  useEffect(() => {
  if (connectionRef.current && caseId) {
    connectionRef.current.invoke("JoinCase", caseId);
  }
}, [caseId]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
    <Header />
    <div className='welcome'>
            <h1>Tervetuloa {userEmail}!</h1>
            <p>Olet kirjautunut sisään onnistuneesti.</p>
    </div>
    
    <div className="case-div">
      {cases && cases.map((c) => (
        c.unreadCount > 0 ?
        <h3 key={c.id} className="case-item" onClick={() => { setCaseId(c.id); fetchCaseMessages(c.id); }} >{c.subject} ({c.unreadCount})</h3>
        :        
        <h3 key={c.id} className="case-item" onClick={() => { setCaseId(c.id); fetchCaseMessages(c.id); }} >{c.subject}</h3>
        )
      )}
      
    </div>
    
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "10px"
        }}
      >
        {messages && messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            currentUserId={userId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
    
    <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Voit ottaa yhteyttä asiantuntijaamme</h2>
                <label htmlFor="message">Viesti:</label>
                <label htmlFor="subject">Aihe: <input id="subject" name="subject" required /></label>
                <textarea id="message" name="message" required></textarea>
                <button type="submit">Lähetä</button>
    </form>
    </>
        
  );
};

export default MainPage;