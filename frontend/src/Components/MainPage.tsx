import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../Components/MessageBubble";
import MessageInput from "../Components/MessageInput";
import { MessageDto } from "../types/case";
import Header from './Header';
import { markAsRead } from "../api/cases";

const MainPage = () => {
  
  type CaseObject = {
    id: string
    createdAt: Date
    isLocked: boolean
    subject: string
    unreadCount: number
  }

  const navigate = useNavigate();

  const { token, userEmail, userRole } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const currentCaseIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const casesRef = useRef<CaseObject[]>([]);
  const joinedCaseIdsRef = useRef<Set<string>>(new Set());
  const [caseId, setCaseId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDto[] | null>(null);
  const [cases, setCases] = useState<CaseObject[] | null>(null);
                       
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentCaseIdRef.current = caseId;
  }, [caseId]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    casesRef.current = cases ?? [];
  }, [cases]);

  const joinKnownCaseGroups = async () => {
    const connection = connectionRef.current;

    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    const knownCaseIds = new Set(casesRef.current.map(c => c.id));

    for (const id of knownCaseIds) {
      if (!joinedCaseIdsRef.current.has(id)) {
        await connection.invoke("JoinCase", id);
        joinedCaseIdsRef.current.add(id);
      }
    }

    for (const id of joinedCaseIdsRef.current) {
      if (!knownCaseIds.has(id)) {
        await connection.invoke("LeaveCase", id);
        joinedCaseIdsRef.current.delete(id);
      }
    }
  };

  const updateCases = (data: CaseObject[]) => {
    casesRef.current = data;
    setCases(data);
    void joinKnownCaseGroups();
  };
  
  const getCases2 = async(token: string) => {
        await axios.get(
                            "http://localhost:5199/cases",
                            {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                            }
                          ).then(response => {
                            
                            const data = response.data;
  
                            updateCases(data);
                            
                            
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
        setMessages(res.data.messages);
        
    }).catch(error => {
      console.log(error);
    })
    
  };

  const openCase = async (id: string) => {
    setCaseId(id);

    if (token) {
      await markAsRead(id, token);
      updateCases((casesRef.current ?? []).map(c =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      ));
    }

    await fetchCaseMessages(id);
  };
  
  const sendMessage = async (text: string) => {
    
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
    ).then(async resp => {
      console.log(resp);
      
      fetchCaseMessages(caseId);
      
      if (token) {
        await markAsRead(caseId, token);
      }
      
      if (token) {
        await getCases2(token);
      }
      
    }).catch(error => {
      console.log(error);
    })
      
  };

  
  useEffect(() => {
    
    const getCases = async(token: string) => {
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
                            updateCases(data)
                                           
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
  
}, [token, navigate]);

  useEffect(() => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5199/hubs/cases", {
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessages", async (messages: MessageDto[]) => {
    console.log("ReceiveMessages", messages);

    const updatedCaseId = messages[0]?.caseId;
    const openCaseId = currentCaseIdRef.current;
    const currentToken = tokenRef.current;

    if (!updatedCaseId || updatedCaseId !== openCaseId || !currentToken) {
      if (currentToken) {
        await getCases2(currentToken);
      }

      return;
    }

    setMessages(messages);
    await markAsRead(updatedCaseId, currentToken);
    await getCases2(currentToken);
    
  });

  connection.onreconnected(async () => {
    joinedCaseIdsRef.current.clear();
    await joinKnownCaseGroups();
  });

  connection.start()
    .then(async () => {
      console.log("Connected");
      await joinKnownCaseGroups();
    })
    .catch(err => {
      console.error("SignalR start error:", err);
    });

  connectionRef.current = connection;

  return () => {
    joinedCaseIdsRef.current.clear();
    connection.stop();
  };
}, [token]);
  
  useEffect(() => {
    joinKnownCaseGroups();
  }, [cases]);
  
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
        <h3 key={c.id} className="case-item" onClick={() => { void openCase(c.id); }} >{c.subject} ({c.unreadCount})</h3>
        :        
        <h3 key={c.id} className="case-item" onClick={() => { void openCase(c.id); }} >{c.subject}</h3>
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
            currentUserId={m.senderId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
    
    {userRole == 1 ? ( <>
    <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Voit ottaa yhteyttä asiantuntijaamme</h2>
                <label htmlFor="message">Viesti:</label>
                <label htmlFor="subject">Aihe: <input id="subject" name="subject" required /></label>
                <textarea id="message" name="message" required></textarea>
                <button type="submit">Lähetä</button>
    </form>
    </>) : null}
    </>
  );
};

export default MainPage;
