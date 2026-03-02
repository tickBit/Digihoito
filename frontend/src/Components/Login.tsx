import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './../App.css';
import Header from './Header';

interface LoginProps {
    role: number;
}

const Login = (props:LoginProps) => {
    
    const navigate = useNavigate();
    
    const { login } = useAuth();
    
    const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        // Make API call to login the user
        axios.post('http://localhost:5199/login', { email, password, role: props.role }, {
                   headers: {
                    "Content-Type": "application/json",
            }})
            .then(response => {
                alert('Login successful');
                login(email, response.data.token);
                navigate('/main');
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
    }
    
    return (
        <>
        <Header />
        <div className='register-login'>
            <h1>Login</h1>
            {props.role === 1 ? <h3>(Patient)</h3> : <h3>(Personel)</h3>}
            <form onSubmit={handleLogin}>
                <input className="form-field" type="text" name="email" placeholder="Email" required />
                <input className="form-field" type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    );
}

export default Login;