import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const Header = () => {
  
  const navigate = useNavigate();
  
  const { token } = useAuth();
    
  return (
    <>
    <header>
    <div className="navbar">
        <h2 onClick={() => token !== null ? navigate("/main") : navigate("/")} className="heading">Digihoito</h2>
        <div className="nav-links">
            <Link className="nav-link" to="/patients">Henkilökunta</Link>
            <Link className="nav-link" to="/doctors">Potilaat</Link>
        </div>
    </div>
    </header>
    </>
  )
}

export default Header;