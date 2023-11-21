import '../styles/User/Login.css';
import useForm from '../../hooks/useForm';
import { useContext } from 'react';
import AuthContext from '../../contexts/authContext';
export default function Login() {

    const isFormValid = () => {
        return values.username.trim() !== '' && values.password.trim() !== '';
    };
    const {
        loginSumbitHandler,
        error
    } = useContext(AuthContext)
    const { values, onChange, onSubmit } = useForm(loginSumbitHandler, { username: '', password: '' });

    return (
        <form className="login-form" onSubmit={onSubmit}>
            <h2>Login</h2>

            <label htmlFor="login-username">Username</label>
            <input
                type="text"
                id="login-username"
                name="username"
                value={values.username}
                onChange={onChange}
                required
            />

            <label htmlFor="login-password">Password</label>
            <input
                type="password"
                id="login-password"
                name="password"
                value={values.password}
                onChange={onChange}
                required
            />

            <button type="submit" disabled={!isFormValid()}>
                Login
            </button>
            {error && (
                <div className='login-error-container'>
                    <p className='error'>{error}</p>
                </div>
            )}
        </form>
    );
}

