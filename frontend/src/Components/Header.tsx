import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

import './../App.css';
import Dropdown from './Dropdown';


const Header = () => {
  
  const navigate = useNavigate();
  
  const { token } = useAuth();
    
  return (
    <>
    <header>
    <div className="navbar">
        <h2 onClick={() => token !== null ? navigate("/main") : navigate("/")} className="heading">Digihoito</h2>
        <div className="nav-links">
            <Dropdown
              label="Henkilökunta"
              href="#/personel"
              items={[
                { label: 'Login', href: '/login_personel' }
              ]}
            />
            
            <Dropdown
              label="Potilaat"
              href="#/patients"
              items={[
                { label: 'Register', href: '/register' },
                { label: 'Login', href: '/login_patient' }
            ]}
          />
        
        </div>
    </div>
    </header>
    </>
  )
}

export default Header;