import Header from "./Components/Header";
import './App.css';

function App() {

  return (
    <>
      <Header />
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
  )
}

export default App;
