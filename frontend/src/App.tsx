import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from "./Components/Header";
import './App.css';
import MainPage from './Components/MainPage';
import Register from './Components/Register';
import Login from './Components/Login';
import { AuthProvider } from './auth/AuthProvider';

function App() {

  return (
    <>
      <AuthProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
      </AuthProvider>
      <div className="content">
        <h1>Tervetuloa!</h1>
        <br />
        <p>Uudet käyttäjät, olkaa hyvät ja rekisteröitykää ensin.</p>
        <br />
        <div className="image-div">
          <img className="doctor-image" src="./assets/doctor-patient.jpg" alt="Doctor and patient" />
        </div>
      </div>
    </>
  );
}

export default App;
