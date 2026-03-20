import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../auth/useAuth";

const Header = () => {
  
  const navigate = useNavigate();
  
  const { token, logout } = useAuth();
    
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
              {...token !== null ? { label: 'Potilaat', href: '#/Potilaat', items: [
                { label: 'Logout', href: '#/logout', onClick: () => logout() }
              ] } : { label: 'Potilaat', href: '#/Potilaat', items: [
                { label: 'Login', href: '/login_patient' },
                { label: 'Register', href: '/register' }
              ] }}
            />
        </div>
    </div>
    </header>
    </>
  )
}

export default Header;
