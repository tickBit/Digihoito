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
                { label: 'Kirjaudu', href: '/login_personel' }
              ]}
            />
            
            <Dropdown
              {...token !== null ? { label: 'Potilaat', href: '/main', items: [
                { label: 'Kirjaudu ulos', href: '/logout', onClick: () => logout() }
              ] } : { label: 'Potilaat', href: '#/Potilaat', items: [
                { label: 'Kirjaudu', href: '/login_patient' },
                { label: 'Rekisteröidy', href: '/register' }
              ] }}
            />
        </div>
    </div>
    </header>
    </>
  )
}

export default Header;
