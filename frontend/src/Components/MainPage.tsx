import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { MessageDto } from "../types/case";
import { markAsRead } from "../api/cases";
import Header from "./Header";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

const PAGE_SIZE = 5;

const MainPage = () => {
  
  type CaseObject = {
    Id: string
    CreatedAt: Date
    IsLocked: boolean
    Subject: string
    UnreadCount: number
  }

  const OPEN = "./assets/lock-open-svgrepo-com.svg";
  const CLOSED = "./assets/lock-closed-svgrepo-com.svg";
  
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
  
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isCurrentLocked, setIsCurrentLocked] = useState<boolean>(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    currentCaseIdRef.current = caseId;
    if (caseId === null) {
      topicRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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

    const knownCaseIds = new Set(casesRef.current.map(c => c.Id));

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

  const updateCases = useCallback((data: CaseObject[]) => {
    casesRef.current = data;
    setCases(data);
    void joinKnownCaseGroups();
  }, []
  );
  
  const closeCase = async(id: string) => {
    
    await axios.post(`http://localhost:5199/cases/${id}/lock`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(resoonse => {
        console.log(resoonse);
        
        getCases2(token!);
        
      }).catch(error => {
        console.log(error);
      });
  }
  
  const getCases2 = useCallback(async(token: string) => {
        await axios.get(
                            `http://localhost:5199/cases?PageNumber=${page}&PageSize=${PAGE_SIZE}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                              }
                            }
                          ).then(response => {
                            
                            const data = response.data;
                            console.log(data.Cases);
                            updateCases(data.Cases as CaseObject[]);
                            setTotalCount(data.TotalCount);

                          }).catch(error => {
                            console.log(error);
                          });
      }, [updateCases, page]
  );
  
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

    if (token) await markAsRead(id, userRole!, token);
    
    await fetchCaseMessages(id);
    getCases2(token!);
    
  };
  
  const sendMessage = async (text: string) => {
    
    if (!caseId) return;

    if (isCurrentLocked) {
      console.log("This case is closed!");
      return;  
    }
    
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
      
      openCase(caseId);
      
      if (token) {
        await markAsRead(caseId, userRole!, token);
        await getCases2(token);
      }
      
    }).catch(error => {
      console.log(error);
    })
      
  };

  
  useEffect(() => {
    
    const getCases = async(token: string) => {
        
        await axios.get(
                            `http://localhost:5199/cases?PageNumber=${page}&PageSize=${PAGE_SIZE}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`
                              }
                              
                            }
                          ).then(response => {
                            
                            const data = response.data;
                            console.log(data.Cases)
                            updateCases(data.Cases);
                            setTotalCount(data.TotalCount);
                            
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
        
        getCases(token!);
      };
  
  initChat();
    
  return () => {
    
  }
  
}, [token, navigate, updateCases, page]);

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
    await markAsRead(updatedCaseId, userRole!, currentToken);
    await getCases2(currentToken);
    
  });

  const varJoinedCaseIdsRefCur = joinedCaseIdsRef.current;
  
  connection.onreconnected(async () => {
    joinedCaseIdsRef.current.clear();
    await joinKnownCaseGroups();
  });

  connection.on("CaseCreated",  async(caseId: string) => {
    console.log("case_created", caseId)
    setCaseId(caseId);
    const currentToken = tokenRef.current;
    if (currentToken) {
      await fetchCaseMessages(caseId);
      await getCases2(currentToken);
    }
    return;
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
    varJoinedCaseIdsRefCur.clear();
    connection.stop();
  };
}, [getCases2, userRole]);
  
  useEffect(() => {
    joinKnownCaseGroups();
  }, [cases]);
  
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
    <Header />
    <div className='welcome'>
            <h1>Tervetuloa {userEmail}!</h1>
            <p>Olet kirjautunut sisään onnistuneesti.</p>
            {userRole === 1 ? (
            <p>Valitse vanha chat tai aloita uusi aihe.</p>
            ) : null}
    </div>

    <div className="parent">
    <div className="case-div">
      {cases ?  (
       <><p><strong>Page: {page} / {Math.ceil(totalCount / PAGE_SIZE)}</strong></p></> 
      ) : null}
      {cases && (
        page === 1 && totalCount > page * PAGE_SIZE && (<><label className="next-prev" onClick={() => setPage(page + 1) }>Next page</label><br /><br /></>) ||
        page > 1 && page < Math.floor(totalCount / PAGE_SIZE) + 1 && (<><label className="next-prev" onClick={() => setPage(page - 1) }>Prev page</label> <label className="next-prev" onClick={() => setPage(page + 1)}>Next page</label><br /><br /> </>) ||
        Math.floor(totalCount / (page * PAGE_SIZE)) <= 5 && (<><label className="next-prev" onClick={() => setPage(page - 1)}>Prev page</label><br /><br /></>)
      )}
      {cases ?
       (
        cases.map((c: CaseObject) => (
        c.UnreadCount > 0 ? (<>
        <img style={{ "cursor": "pointer" }} onClick={ userRole === 2 ? () => closeCase(c.Id) : undefined } src={c.IsLocked ? CLOSED : OPEN} width="18px" height="18px"/> <label key={c.Id} className="case-item" onClick={ () => { openCase(c.Id); setIsCurrentLocked(c.IsLocked); }} >{c.Subject} ({c.UnreadCount})</label>
        <br /><br />
        </>) 
        : (<>  
        <img style={{ "cursor": "pointer" }} onClick={ userRole === 2 ? () => closeCase(c.Id) : undefined } src={c.IsLocked ? CLOSED : OPEN} width="18px" height="18px"/> <label key={c.Id} className="case-item" onClick={ () => { { openCase(c.Id); setIsCurrentLocked(c.IsLocked); }}} >{c.Subject}</label>
        <br /><br />
        </>)))
      ) : null}
    </div>

    {caseId === null && userRole === 1 ? ( <>
    <div className="contact-form-div">
    <form className="contact-form" onSubmit={handleSubmit}>
    <div ref={topicRef} />
                <h2>Voit ottaa yhteyttä asiantuntijaamme</h2>
                <label htmlFor="subject"><strong>Uusi aihe: </strong><input id="subject" name="subject" placeholder="Kirjoita aihe..." required /></label>
                <textarea id="message" name="message" placeholder="Kuvaus aiheesta..." required></textarea>
                <button type="submit">Lähetä</button>
    </form>
    </div>
    </>) : null}
    
    {caseId !== null || userRole === 2 ? ( 
     <>
    <div className="chat-view">
      <div ref={chatRef} />
      <h2>Chat</h2>
      {userRole === 1 && (<>
      <button className="button-close" onClick={() => setCaseId(null) } >Close chat</button>
      </>)}
      
      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
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
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
    </>)
    : null}
    </div>
    </>
  );
};

export default MainPage;
