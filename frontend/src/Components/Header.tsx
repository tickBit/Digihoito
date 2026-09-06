import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../auth/useAuth";

const Header = () => {
  
  const navigate = useNavigate();
  
  const { token, logout, userRole } = useAuth();
  
  return (
    <>
    <header>
    {userRole !== null && userRole === 2 && <><div className="navbar-personel">
      
        <h2 onClick={() => token !== null ? navigate("/main") : navigate("/")} className="heading">Digihoito</h2>
        <div className="nav-links">
            <Dropdown
              {...token !== null && userRole === 2 ? { label: 'Henkilökunta', href: '/main', items: [
                { label: 'Kirjaudu ulos', href: '/logout', onClick: () => logout() }
              ] } : { label: 'Henkilökunta', href: '#/Personel', items: [
                { label: 'Kirjaudu', href: '/login_personel' },
              ] }}
            />
            
        </div>
        </div>
        </>
    }
    {userRole === null || userRole === 1 && <div className="navbar">
     <h2 onClick={() => token !== null ? navigate("/main") : navigate("/")} className="heading">Digihoito</h2>
            <Dropdown
              {...token !== null && userRole === 1 ? { label: 'Potilaat', href: '/main', items: [
                { label: 'Kirjaudu ulos', href: '/logout', onClick: () => logout() }
              ] } : { label: 'Potilaat', href: '#/Potilaat', items: [
                { label: 'Kirjaudu', href: '/login_patient' },
                { label: 'Rekisteröidy', href: '/register' }
              ] }}
            />
    </div>
    }
    {token === null && <>
    <div className="navbar">
    <h2 className="heading">Digihoito</h2>
      
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
        </>
    }
    </header>
    </>
  )
}

export default Header;
