import './App.css';
import { useAuth } from './auth/useAuth';

import Header from "./Components/Header";

function App() {

  const { token } = useAuth();
  
  return (
    <>
      <Header />
      <div className="content">
        {!token && (
          <>
        <h1>Tervetuloa!</h1>
        <br />
        <p>Uudet käyttäjät, olkaa hyvät ja rekisteröitykää ensin.</p>
        <br />
        <div className="image-div">
          <img className="doctor-image" src="./assets/doctor-patient.jpg" alt="Doctor and patient" />
        </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
